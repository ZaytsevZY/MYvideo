"""Capture pre-edit script content and existing art/runtime hashes; no image edits."""
import hashlib, json, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = pathlib.Path(__file__).parent / 'provenance' / 'inputs.json'
def sha(data): return hashlib.sha256(data).hexdigest()
chapters = []
for n in range(1, 7):
    path = ROOT / f'scripts/final/shot/{n:02}.md'
    data = path.read_bytes(); text = data.decode()
    audio = re.search(r'### audio content\s*<start>\s*([\s\S]*?)\s*<end>', text).group(1)
    refs = text.split('## references', 1)[1]
    chapters.append(dict(path=str(path.relative_to(ROOT)), sha256=sha(data), audio=audio,
                         audioSha256=sha(audio.encode()), referencesSha256=sha(refs.encode())))
old_art = {}
for tree in ('arts/characters', 'arts/backgrounds', 'arts/items', 'arts/static'):
    for p in (ROOT/tree).rglob('*.png'):
        rel = str(p.relative_to(ROOT))
        if '/shared/' in rel or 'arts/static/story-assets-v01/' in rel or rel.startswith(('arts/static/03/', 'arts/static/04/')):
            continue
        old_art[rel] = sha(p.read_bytes())
runtime = {str(p.relative_to(ROOT)): sha(p.read_bytes()) for p in (ROOT/'arts/actions').rglob('*.mjs')}
OUT.write_text(json.dumps(dict(date='2026-10-18', chapters=chapters, existingPng=old_art, existingRuntime=runtime), ensure_ascii=False, indent=2)+'\n')
print('Captured six scripts,', len(old_art), 'existing PNGs,', len(runtime), 'runtime files')
