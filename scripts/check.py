"""Validate editorial data and generated internal navigation."""
import json
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
R=Path(__file__).resolve().parents[1]
d=json.loads((R/'content.json').read_text())
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.anchors=[];self.files=[];self.details=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='details' and 'event' in a.get('class','').split():self.details+=1
  if 'href' in a and a['href'].startswith('#'):self.anchors.append(a['href'][1:])
  for k in ('src','href'):
   v=a.get(k,'')
   if v and not v.startswith(('#','https:','http:')):self.files.append(v)
p=Page();p.feed((R/'index.html').read_text())
assert len(p.ids)==len(set(p.ids)), 'Duplicate HTML id'
assert all(a in p.ids for a in p.anchors), 'Broken internal anchor'
assert all((R/f).is_file() for f in p.files), 'Missing local asset'
n=0
for era in d['eras']:
 dates=[e[1] for e in era['events']]
 assert dates==sorted(dates), f'Chronology error in {era["id"]}'
 for e in era['events']:
  assert len(e)==8 and all(e), f'Incomplete event: {e}'
  assert e[2] in p.ids and e[7], f'Missing event or source: {e[2]}'
  assert all(ref in d['sources'] for ref in e[7]),f'Unknown source: {e[2]}'
  n+=1
assert p.details==n
all_event_ids={event[2] for era in d['eras'] for event in era['events']}
for origin,targets in d.get('related',{}).items():
 assert origin in all_event_ids, f'Unknown related-event origin: {origin}'
 assert len(targets)==len(set(targets)) and origin not in targets, f'Invalid related links: {origin}'
 assert all(target in all_event_ids for target in targets), f'Broken related link: {origin}' 
for label,url in d['sources'].values():
 assert urlparse(url).scheme=='https' and urlparse(url).netloc,label
print(f'PASS: {n} events, {len(d["eras"])} eras, {len(d["sources"])} sources; dates, IDs, anchors and assets valid.')
