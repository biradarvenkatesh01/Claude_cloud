import numpy as np
from PIL import Image
from collections import deque
import sys
S=sys.argv[1]
im=np.array(Image.open(f'{S}/assets/hero.jpg').convert('RGB')).astype(int)
H,W,_=im.shape
sky=np.array([236,229,215])
# sample sky
print('sky sample', im[150,512], im[100,520])
sky=im[90:200,500:540].reshape(-1,3).mean(0)
d=np.sqrt(((im-sky)**2).sum(2))
cand=d<40
# flood fill from top border and side borders above y=300
seen=np.zeros_like(cand)
q=deque()
for x in range(W):
    if cand[0,x]: q.append((0,x)); seen[0,x]=True
for y in range(0,300):
    for x in (0,W-1):
        if cand[y,x] and not seen[y,x]: q.append((y,x)); seen[y,x]=True
while q:
    y,x=q.popleft()
    for dy,dx in((1,0),(-1,0),(0,1),(0,-1)):
        ny,nx=y+dy,x+dx
        if 0<=ny<H and 0<=nx<W and not seen[ny,nx] and cand[ny,nx] and ny<520:
            seen[ny,nx]=True; q.append((ny,nx))
alpha=np.where(seen,0,255).astype(np.uint8)
a=Image.fromarray(alpha).filter(__import__('PIL.ImageFilter',fromlist=['x']).GaussianBlur(1.2))
rgba=Image.open(f'{S}/assets/hero.jpg').convert('RGBA'); rgba.putalpha(a)
rgba.crop((0,0,420,575)).save(f'{S}/assets/treeL.png')
rgba.crop((600,0,1024,575)).save(f'{S}/assets/treeR.png')
rgba.crop((0,222,1024,560)).save(f'{S}/assets/building.png')
print('sky',sky)
Image.open(f'{S}/assets/paper-pulp-tile.png').convert('RGB').save(f'{S}/assets/tex.png')
