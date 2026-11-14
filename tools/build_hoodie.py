"""Build the vform garment GLB. Requires Pillow and NumPy, for asset editing only."""

import argparse
import io
import json
import math
import struct
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
TAU = math.tau
PI = math.pi


def curve(t, *keys):
    """Catmull-Rom interpolation through evenly spaced tailoring profiles."""
    segment = min(int(t * (len(keys) - 1)), len(keys) - 2)
    f = t * (len(keys) - 1) - segment
    a, b = keys[max(segment - 1, 0)], keys[segment]
    c, d = keys[segment + 1], keys[min(segment + 2, len(keys) - 1)]
    return b + 0.5 * f * (c - a + f * (2*a - 5*b + 4*c - d + f * (3*(b-c) + d-a)))


def bell(x, center, width):
    return math.exp(-((x-center)/width)**2)


def torso(u, t):
    a = TAU * u - PI / 2
    width = curve(t, .674, .73, .76, .75, .74, .77, .81, .84, .81, .33)
    depth = curve(t, .276, .325, .33, .32, .344, .35, .346, .32, .28, .206)
    c, s = math.cos(a), math.sin(a)
    z = .035 * math.sin(t*PI) + depth * s
    x = width * math.copysign(abs(c)**.86, c)
    y = -.925 + 1.78*t
    y -= .055 * abs(c)**3 * bell(t, 1, .13)
    y += .064 * bell(c, .77, .52) * bell(t, .90, .12)
    y += .045 * math.cos(a+.8) * (1-t)**4 + .023 * math.sin(3*a+1.8) * (1-t)
    ripple = .022 * math.sin(7*a + 2.9*t) + .010 * math.cos(11*a - 7*t)
    ripple *= math.sin(PI*t)**.65
    ripple += .030 * bell(t, .10 + .043*math.sin(3*a), .044)
    ripple -= .021 * bell(t, .148 + .045*math.sin(3*a+.35), .03)
    ripple += .029 * bell(t, .225 - .105*math.cos(a-.25), .056) * abs(c)
    ripple -= .022 * bell(t, .279 - .098*math.cos(a-.55), .048) * abs(c)
    ripple += .032 * bell(t, .76 + .14*math.sin(a+.45), .075) * abs(c)
    ripple -= .034 * bell(t, .695 + .092*math.sin(a+.45), .05) * abs(c)
    for center, width, amplitude in ((.49,.115,.061),(-.35,.14,.038),(.70,.092,-.039),(-.61,.12,-.050)):
        fold = center + .16*t + .061*math.sin(t*5.4+center)
        ripple += amplitude * bell(c, fold, width) * bell(s, -1, .65) * math.sin(PI*t)**.65
    ripple += .018 * bell(t, .13+.079*math.sin(a-1), .022)
    ripple -= .016 * bell(t, .159+.081*math.sin(a-1), .020)
    return x + ripple*c, y, z + ripple*s


def sleeve(side, u, t):
    a = TAU*u
    bend = 1 if side == -1 else -.65
    x = side*curve(t, .403, .663, .907, 1.095, 1.285, 1.41)
    y = curve(t, .609, .514, .232, -.085, -.404, -.66) + side*t*.155
    z = curve(t, .005, -.011, -.029, -.036, -.06, .012) + .103*t*t*bend
    r = curve(t, .193, .309, .309, .286, .264, .161)
    w = .013*math.sin(4*a + 4.8*t) + .007*math.sin(7*a - 10*t + side)
    w *= math.sin(t*PI)**.62
    for center, size, phase in ((.24,.009,2),(.53,.025,4),(.69,.031,2),(.81,.036,1),(.925,.048,5)):
        d = center + .059*math.sin(2*a+phase) + .022*math.sin(3*a+side)
        w += size * (bell(t,d,.039) - .64*bell(t,d+.035,.022))
    w += .026 * bell(math.cos(a-.78*t), .93, .12) * bell(t,.49,.28)
    r += w
    x += side*.88*r*math.cos(a)
    y += .476*r*math.cos(a)
    z += r*1.035*math.sin(a)
    return x, y, z


def hood(u, v, inside=False):
    # Oval face opening, flowing back to a closed crown.
    a = TAU*u
    b = (1-v)*curve((math.sin(a)+1)/2, 1.79, 2.10, 1.78)
    s = math.sin(b)
    y = 1.009 + .417*s*math.sin(a) - .19*v*v
    z = .052 - .465*math.cos(b) - .055*math.sin(a)*s
    x = .21 + .445*s*math.cos(a) - .060*s*math.sin(a)
    drift = x-.21
    back = .38 + .62*math.sin(PI*v*.88)
    folds = 0
    for level, width, amplitude, slant in (
        (1.316,.029,.022,.12), (1.257,.032,-.019,.15),
        (1.155,.064,.048,.29), (1.071,.045,-.032,.24),
        (.963,.075,.042,.15), (.887,.046,-.021,.09),
    ):
        level += drift*slant + .041*math.sin(6*drift+level)
        folds += amplitude * bell(y,level,width) * back
    if inside:
        x = .21 + drift*.905
        y = .98 + .897*(y-.98)
        z += .010 + .035*math.cos(b)
    else:
        x += .75*folds*s*math.cos(a)
        y += .30*folds*s*math.sin(a)
        z -= folds*math.cos(b)
    return x, y, z


def waist(u, t):
    a = TAU*u - PI/2
    x,y,z = torso(u, 0)
    r = .035*math.sin(PI*t) - .017*t - .047*t**12
    y -= (.185 + .032*math.cos(a+1.1))*t
    return x + r*math.cos(a), y, z + r*math.sin(a) + .045*t


def waist_lining(u,t):
    a = TAU*u - PI/2
    x,y,z = waist(u,1)
    return x-.048*t*math.cos(a), y+.19*t, z-.038*t*math.sin(a)


def wrist(side, u, t):
    a = TAU*u
    x,y,z = sleeve(side,u,1)
    r = .011*math.sin(PI*t) - .017*t - .052*t**12
    return x+side*(.089*t+.88*r*math.cos(a)), y-.145*t+.476*r*math.cos(a), z+.015*t+r*math.sin(a)


def cuff_lining(side,u,t):
    a = TAU*u
    x,y,z = wrist(side,u,1)
    return x-side*t*(.074+.035*math.cos(a)), y+t*(.115-.019*math.cos(a)), z-.039*t*math.sin(a)


def pocket(u, t):
    a = TAU*u
    width = curve(t, .44, .48, .47, .37, .30)
    x = width*math.cos(a)
    y = -.73 + .49*t
    z = .325 + .049*math.sin(a) + .053*math.sin(PI*t)
    z += .013*math.sin(17*x+9*t)*math.sin(PI*t)
    return x,y,z


def grid(name, sampler, material, around, along, outward=True):
    uv = np.array([(u/around,v/along) for v in range(along+1) for u in range(around+1)])
    pos = np.array([sampler(u,v) for u,v in uv])
    indices = []
    for row in range(along):
        for col in range(around):
            a = row*(around+1)+col
            b, c = a+1, a+around+1
            indices.extend([(a,c,b),(b,c,c+1)] if outward else [(a,b,c),(b,c+1,c)])
    faces = np.array(indices)
    raw = np.cross(pos[faces[:,1]]-pos[faces[:,0]], pos[faces[:,2]]-pos[faces[:,0]])
    n = np.zeros(pos.shape)
    for corner in range(3):
        np.add.at(n, faces[:,corner], raw)
    n = n.reshape(along+1,around+1,3)
    n[:,0] += n[:,-1]
    n[:,-1] = n[:,0]
    n = n.reshape(-1,3)
    n /= np.maximum(np.linalg.norm(n,axis=1,keepdims=True),1e-8)
    # Store cavity shading in linear color so recesses stay defined under rotating lights.
    panel = pos.reshape(along+1,around+1,3)
    normals = n.reshape(panel.shape)
    occlusion = np.ones((along+1,around+1,1))
    for step, strength in ((2,25),(5,15),(10,8)):
        if along <= step * 2 or around <= step * 2:
            continue
        center = panel[step:-step]
        interior = center[:,:-1]
        horizontal = np.roll(interior,step,axis=1) + np.roll(interior,-step,axis=1) - 2*interior
        vertical = panel[:-2*step,:-1] + panel[2*step:,:-1] - 2*interior
        cavity = np.sum((horizontal + vertical)*normals[step:-step,:-1],axis=2)
        occlusion[step:-step,:-1,0] *= 1 - np.clip(cavity*strength,0,.36)
    occlusion[:,-1] = occlusion[:,0]
    uv[:,1] = 1-uv[:,1]
    return name, pos, n, uv, faces, occlusion.reshape(-1,1), material


def cord(u, t, side):
    a = TAU*u
    return (
        .16*side + .045*math.sin(4*t+side) + .008*math.cos(a),
        .785 - t*(.49 + side*.06),
        .305+.082*math.sin(PI*t) + .042*t + .008*math.sin(a),
    )


def neck(u, t):
    a = TAU*u - PI/2
    return .326*math.cos(a)*(1-.37*t), .842+.021*math.sin(a)-.145*t, .203*math.sin(a)*(1-.40*t)


def piping(u, v):
    a = TAU*u
    p = np.array(hood(u,0))
    p += (.010*math.cos(a)*math.cos(TAU*v), .010*math.sin(a)*math.cos(TAU*v), .010*math.sin(TAU*v))
    return p


def welt(surface, path, direction, radius, taper=lambda t: 1, stitches=False):
    """Lay a sewn cord or a dashed topstitch along a panel's UV coordinates."""
    def sample(u, t):
        p = np.array(surface(*path(t)))
        outward = np.array(direction(t))
        outward /= np.linalg.norm(outward)
        before = np.array(surface(*path(max(0,t-.001))))
        after = np.array(surface(*path(min(1,t+.001))))
        across = np.cross(outward, after-before)
        across /= max(np.linalg.norm(across),1e-8)
        a = TAU*u
        size = radius * taper(t)
        if stitches:
            dash = math.sin(TAU*stitches*t)
            size *= .12 + .88*max(0,dash)**.38
        return p + size*(math.cos(a)*across + (.24+math.sin(a))*outward)
    return sample


def side_direction(t):
    a = TAU*t - PI/2
    return math.cos(a), 0., math.sin(a)


def sleeve_direction(side,t):
    a = TAU*t
    return side*.88*math.cos(a), .476*math.cos(a), math.sin(a)


def crown_path(t, offset=0):
    return (.25 + offset + .015*math.sin(PI*t), .025 + .96*t)


def crown_direction(t):
    a = PI*(.065+.9*t)
    return .12, math.cos(a)*.8, math.sin(a)*-.9


def texture_assets(print_path):
    dim = 2048
    rng = np.random.default_rng(42)
    yy, xx = np.mgrid[:dim,:dim].astype(np.float32)
    yarn = np.cos(TAU*xx/5.2 + .72*np.sin(TAU*yy/7.4) + .57*np.sin(yy/57+xx/32))
    loop = np.sin(TAU*yy/8.4 + np.cos(TAU*xx/10.4))
    grain = (.64*yarn + .36*loop + .27*yarn*loop + rng.normal(0,.20,(dim,dim))).astype(np.float32)
    base = np.uint8(np.clip(20 + grain*4.7,0,255))
    body = Image.fromarray(base).convert("RGB")
    artwork = Image.open(print_path).convert("RGB")
    back = artwork.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    back = back.resize((round(dim*.283), round(dim*.757)), Image.Resampling.LANCZOS)
    backx, backy = round(dim*.014), round(dim*.10)
    # The middle of the rear print is on the closed torso UV seam.
    ink = np.asarray(back).astype(np.float32)
    orange = np.clip((ink[:,:,0]-ink[:,:,1])/70,0,1)
    ink *= (1.43+.10*orange)[:,:,None]
    opacity = np.uint8(np.clip((ink.max(2)-11)*9,0,255))
    ink += 2.5*grain[backy:backy+back.height,:back.width,None]
    back = Image.fromarray(np.uint8(np.clip(ink,0,255)))
    alpha = opacity
    alpha = Image.fromarray(alpha)
    offset = back.width//2
    body.paste(back, (backx-offset,backy), alpha)
    body.paste(back, (dim+backx-offset,backy), alpha)
    logo = artwork.crop((int(artwork.width*.36),int(artwork.height*.018),int(artwork.width*.64),int(artwork.height*.073)))
    logo.thumbnail((102,29), Image.Resampling.LANCZOS)
    luma = logo.convert("L")
    body.paste(logo,(round(dim*.55),round(dim*.30)),luma.point(lambda v: min(v*2,255)))
    dx,dy = np.gradient(grain)
    normal = make_normal(dx, dy, .34, .31)
    surface = Image.fromarray(base[:1024,:1024]).convert("RGB")
    rib_x, rib_y = xx[:1024,:1024], yy[:1024,:1024]
    phase = TAU*rib_x/12.4 + .15*np.sin(TAU*rib_y/38)
    rib = np.cos(phase) + .19*np.cos(2*phase)
    rib_height = .87*rib + .23*grain[:1024,:1024] + .15*np.sin(TAU*rib_y/5)
    rib_dx,rib_dy = np.gradient(rib_height)
    rib_base = Image.fromarray(np.uint8(np.clip(23+9*rib_height,0,255))).convert("RGB")
    rib_normal = make_normal(rib_dx, rib_dy, 1.66, .69)
    surface_normal = normal.crop((0,0,1024,1024))
    return [body, surface, normal, rib_base, rib_normal, surface_normal]


def make_normal(dx, dy, strength_x, strength_y):
    z = np.ones_like(dx)
    vector = np.stack((-dx*strength_x, dy*strength_y, z),axis=-1)
    vector /= np.linalg.norm(vector,axis=-1,keepdims=True)
    return Image.fromarray(np.uint8(np.clip(127.5+127.5*vector,0,255)))


def build(print_path):
    pieces = [
        grid("Body and back print",torso,0,224,135),
        grid("Neck lining",neck,2,96,18),
        grid("Ribbed waistband",waist,3,176,36,False),
        grid("Inside waistband",waist_lining,2,112,18,False),
        grid("Kangaroo pocket",pocket,1,100,38),
        grid("Hood exterior",hood,1,164,100),
        grid("Hood lining",lambda u,t:hood(u,t,True),2,96,46,False),
        grid("Hood binding",piping,1,144,10),
        grid("Crown seam",welt(hood,crown_path,crown_direction,.008),1,8,116),
        grid("Crown topstitch",welt(hood,lambda t: crown_path(t,.012),crown_direction,.0021,
            stitches=64),4,7,340),
        grid("Hem seam",welt(torso,lambda t:(t,.017),side_direction,.011),1,9,200),
        grid("Hem topstitch",welt(torso,lambda t:(t,.026),side_direction,.0023,
            stitches=106),4,7,540),
    ]
    for side in [-1,1]:
        name = "Left" if side < 0 else "Right"
        def panel(u, t, side=side):
            return sleeve(side,u,t)
        def normal(t, side=side):
            return sleeve_direction(side,t)

        pieces.extend([
            grid(name+" sleeve",panel,1,124,90,side==-1),
            grid(name+" ribbed cuff",lambda u,t:wrist(side,u,t),3,104,38,side==-1),
            grid(name+" cuff lining",lambda u,t:cuff_lining(side,u,t),2,72,14,side==-1),
            grid(name+" drawcord",lambda u,t:cord(u,t,side),2,12,36,False),
            grid(name+" dropped shoulder seam",welt(panel,lambda t:(t,.282+.026*math.sin(TAU*t)),
                normal,.008),1,8,128),
            grid(name+" shoulder topstitch",welt(panel,lambda t:(t,.294+.026*math.sin(TAU*t)),
                normal,.0017,stitches=82),4,7,420),
            grid(name+" wrist seam",welt(panel,lambda t:(t,.988),normal,.007),1,8,88),
        ])

    data = bytearray()
    doc = {"asset":{"version":"2.0","generator":"vform garment builder"},"scene":0,
           "extensionsUsed":["KHR_materials_sheen"],
           "scenes":[{"nodes":[]}],"nodes":[],"meshes":[],"buffers":[],"bufferViews":[],
           "accessors":[],"images":[],"textures":[],"materials":[]}

    def view(blob, target=None):
        offset = len(data)
        data.extend(blob)
        data.extend(bytes((-len(data))%4))
        result = {"buffer":0,"byteOffset":offset,"byteLength":len(blob)}
        if target:
            result["target"] = target
        doc["bufferViews"].append(result)
        return len(doc["bufferViews"])-1

    def accessor(values, storage, kind, component, target):
        values = values.astype(storage)
        entry = {"bufferView": view(values.tobytes(),target), "componentType":component,
                 "count":len(values),"type":kind}
        if kind=="VEC3" and component==5126:
            entry.update(min=values.min(0).tolist(),max=values.max(0).tolist())
        doc["accessors"].append(entry)
        return len(doc["accessors"])-1

    # Merge panels and stitches by material, keeping the scene to five draw calls.
    for material in range(5):
        selected = [p for p in pieces if p[-1]==material]
        xyz, nor, uv, faces, colors = [], [], [], [], []
        count=0
        for _, points, normals, coords, indices, shade, _ in selected:
            xyz.append(points)
            nor.append(normals)
            uv.append(coords)
            faces.append(indices+count)
            colors.append(np.repeat(shade,3,axis=1))
            count += len(points)
        primitive = {"attributes":{
            "POSITION":accessor(np.concatenate(xyz),"<f4","VEC3",5126,34962),
            "NORMAL":accessor(np.concatenate(nor),"<f4","VEC3",5126,34962),
            "TEXCOORD_0":accessor(np.concatenate(uv),"<f4","VEC2",5126,34962),
            "COLOR_0":accessor(np.concatenate(colors),"<f4","VEC3",5126,34962)},
            "indices":accessor(np.concatenate(faces).ravel(),"<u4","SCALAR",5125,34963),"material":material}
        doc["meshes"].append({"primitives":[primitive]})
        doc["nodes"].append({"mesh":material})
        doc["scenes"][0]["nodes"].append(material)

    for index, img in enumerate(texture_assets(print_path)):
        binary = io.BytesIO()
        quality = 82 if index in (2,4,5) else 87
        img.save(binary,format="JPEG",quality=quality,optimize=True)
        doc["images"].append({"bufferView":view(binary.getvalue()),"mimeType":"image/jpeg"})
        doc["textures"].append({"source":len(doc["images"])-1})
    materials = [
        ("Printed cotton",0,2,1.,.91,1.03),
        ("Cotton fleece",1,5,1.,.94,.78),
        ("Interior lining",1,5,.43,.97,.51),
        ("Rib knit",3,4,.86,.93,1.03),
        ("Topstitch",1,5,1.,.94,.31),
    ]
    for name, color, normal, tint, roughness, bump in materials:
        doc["materials"].append({"name":name,"doubleSided":True,
            "pbrMetallicRoughness":{"baseColorTexture":{"index":color},
                "baseColorFactor":[tint,tint,tint,1],"metallicFactor":0,"roughnessFactor":roughness},
            "normalTexture":{"index":normal,"scale":bump},
            "extensions":{"KHR_materials_sheen":{"sheenColorFactor":[.082,.077,.073] if name!="Topstitch"
                else [.12,.11,.10],"sheenRoughnessFactor":.73}}})
    doc["buffers"].append({"byteLength":len(data)})
    meta = json.dumps(doc,separators=(",",":")).encode()
    meta += b" "*((-len(meta))%4)
    total = 28+len(meta)+len(data)
    dest = ROOT/"tools/vform-hoodie.glb"
    dest.write_bytes(struct.pack("<4sII",b"glTF",2,total) + struct.pack("<I4s",len(meta),b"JSON")
                     + meta + struct.pack("<I4s",len(data),b"BIN\0") + data)
    print(f"{dest}: {total:,} bytes")


if __name__=="__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("print",type=Path,help="Portrait artwork to wrap onto the hoodie")
    build(parser.parse_args().print)
