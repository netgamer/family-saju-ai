import { useEffect, useMemo, useState } from 'react';

type Member = { id: string; name: string; role: string; birthDate: string; birthTime: string; gender: string };
const STORAGE_KEY = 'family-saju-members-v2';
const emptyForm = { name: '', role: '아빠', birthDate: '', birthTime: '', gender: '남성' };
const roles = ['본인', '아빠', '엄마', '아들', '딸', '할아버지', '할머니', '배우자', '형제', '자매', '기타'];
const avatar = (role: string) => ['엄마', '할머니', '딸', '자매'].includes(role) ? '👩' : ['아빠', '할아버지', '아들', '형제', '배우자'].includes(role) ? '👨' : role === '본인' ? '🧑' : '👤';

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loaded, setLoaded] = useState(false);
  const [meId, setMeId] = useState<string | null>(null);
  const [compareId, setCompareId] = useState('');

  useEffect(() => { try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const data = JSON.parse(saved); setMembers(data.members ?? data); setMeId(data.meId ?? null); } } catch {} setLoaded(true); }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify({ members, meId })); }, [members, meId, loaded]);
  const selected = useMemo(() => members.find(m => m.id === selectedId) ?? members[0], [members, selectedId]);
  const compare = members.find(m => m.id === compareId);

  function openAdd() { setEditingId(null); setForm(emptyForm); setShowForm(true); }
  function openEdit(m: Member) { setEditingId(m.id); setForm({ ...m }); setShowForm(true); }
  function saveMember(e: React.FormEvent) { e.preventDefault(); if (!form.name || !form.birthDate || !form.birthTime) return; if (editingId) { setMembers(p => p.map(m => m.id === editingId ? { ...m, ...form } : m)); setSelectedId(editingId); } else { const member = { ...form, id: crypto.randomUUID() }; setMembers(p => [...p, member]); setSelectedId(member.id); if (!meId && form.role === '본인') setMeId(member.id); } setShowForm(false); setEditingId(null); setForm(emptyForm); }
  function removeMember(id: string) { if (!window.confirm('이 가족 구성원을 삭제할까요?')) return; setMembers(p => p.filter(m => m.id !== id)); if (selectedId === id) setSelectedId(null); if (meId === id) setMeId(null); if (compareId === id) setCompareId(''); }

  return <div className="app">
    <header className="topbar"><div className="brand"><span className="brand-mark">☯</span><div><strong>Family Saju AI</strong><small>가족을 이해하는 새로운 방법</small></div></div><span className="version">MVP 0.3</span></header>
    <div className="workspace">
      <aside className="sidebar"><div className="sidebar-title"><div><p className="eyebrow">MY BOARD</p><b>내 가족</b></div><button className="add-mini" onClick={openAdd}>＋</button></div><div className="board-item active"><span className="board-icon">☯</span><span><b>우리 가족</b><small>{members.length}명 등록됨</small></span></div><div className="sidebar-label">가족 구성원</div>{members.length === 0 ? <div className="sidebar-empty">아직 등록된 가족이 없습니다.</div> : members.map(m => <button key={m.id} className={`side-member ${selected?.id === m.id ? 'selected' : ''}`} onClick={() => setSelectedId(m.id)}><span>{avatar(m.role)}</span><span><b>{m.name}</b><small>{m.role}{m.id === meId ? ' · 나' : ''}</small></span></button>)}<button className="sidebar-add" onClick={openAdd}>＋ 가족 구성원 추가</button></aside>
      <main className="content">
        <section className="hero"><div><p className="eyebrow">FAMILY RELATIONSHIP</p><h1>사주를 보고,<br/><em>대화의 방법</em>을 찾습니다.</h1><p className="hero-copy">가족의 만세력 정보를 한곳에 모으고, 두 사람의 관계와 상황을 바탕으로 더 나은 대화 방법을 찾아보세요.</p></div><div className="hero-card"><span>현재 단계</span><strong>{members.length ? '가족 프로필 준비 완료' : '가족 정보 등록'}</strong><p>{members.length ? '가족을 선택하고 아래에서 관계 분석을 시작할 수 있습니다.' : '가족의 생년월일과 태어난 시각을 등록해 주세요.'}</p></div></section>
        <section className="section"><div className="section-head"><div><p className="eyebrow">MY FAMILY</p><h2>가족 구성원</h2></div><button className="primary" onClick={openAdd}>＋ 가족 추가</button></div>{members.length === 0 ? <div className="empty"><div className="empty-icon">👨‍👩‍👧‍👦</div><h3>아직 가족이 등록되지 않았어요</h3><p>이름, 생년월일, 태어난 시각을 입력하면 이 브라우저에 가족 프로필이 저장됩니다.</p><button className="primary" onClick={openAdd}>첫 가족 등록하기</button></div> : <div className="members">{members.map(m => <button className={`member ${selected?.id === m.id ? 'active' : ''}`} key={m.id} onClick={() => setSelectedId(m.id)}><span className="avatar">{avatar(m.role)}</span><span><b>{m.name}</b><small>{m.role} · {m.birthDate} {m.birthTime}</small></span></button>)}</div>}</section>
        {selected && <section className="profile"><div className="profile-head"><div><p className="eyebrow">SELECTED MEMBER</p><h2>{avatar(selected.role)} {selected.name}</h2><p>{selected.role} · {selected.gender} · {selected.birthDate} {selected.birthTime}</p></div><div className="profile-actions"><span className="status">저장됨</span><button onClick={() => openEdit(selected)}>수정</button><button className="danger" onClick={() => removeMember(selected.id)}>삭제</button></div></div><div className="notice"><b>만세력 정보</b><span>생년월일시가 등록되었습니다. 다음 단계에서 정확한 만세력 계산 결과를 연결합니다.</span></div><div className="saju-placeholder"><div>년주<br/><b>계산 대기</b></div><div>월주<br/><b>계산 대기</b></div><div>일주<br/><b>계산 대기</b></div><div>시주<br/><b>계산 대기</b></div></div></section>}
        {members.length > 1 && <section className="section compare"><div className="section-head"><div><p className="eyebrow">RELATIONSHIP</p><h2>두 사람의 관계 보기</h2></div></div><div className="compare-box"><div><label>나 / 기준 가족<select value={meId ?? ''} onChange={e => setMeId(e.target.value)}><option value="">선택하세요</option>{members.map(m => <option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}</select></label></div><div className="arrow">↔</div><div><label>상대 가족<select value={compareId} onChange={e => setCompareId(e.target.value)}><option value="">선택하세요</option>{members.filter(m => m.id !== meId).map(m => <option key={m.id} value={m.id}>{m.name} · {m.role}</option>)}</select></label></div></div>{meId && compare ? <div className="relationship-ready"><b>{members.find(m => m.id === meId)?.name} × {compare.name}</b><span>두 사람을 선택했습니다. 다음 단계에서 사주 기반 관계 분석과 대화 가이드를 연결합니다.</span></div> : <div className="relationship-empty">두 사람을 선택하면 관계 분석을 시작할 수 있어요.</div>}</section>}
        <section className="section guide"><p className="eyebrow">AI CONVERSATION</p><h2>가족과 어떻게 이야기할까요?</h2><p>가족을 등록하고 두 사람을 선택하면 상황별 대화 가이드로 이어집니다.</p><div className="flow"><span>① 나 선택</span><i>→</i><span>② 상대 선택</span><i>→</i><span>③ 상황 입력</span><i>→</i><strong>AI 대화 가이드</strong></div></section>
      </main>
    </div>
    {showForm && <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}><form className="modal" onSubmit={saveMember} onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">{editingId ? 'EDIT MEMBER' : 'NEW MEMBER'}</p><h2>{editingId ? '가족 정보 수정' : '가족 등록'}</h2></div><button type="button" className="close" onClick={() => setShowForm(false)}>×</button></div><label>이름<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="예: 홍길동" required /></label><label>가족 관계<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{roles.map(r => <option key={r}>{r}</option>)}</select></label><div className="row"><label>생년월일<input type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} required /></label><label>태어난 시각<input type="time" value={form.birthTime} onChange={e => setForm({ ...form, birthTime: e.target.value })} required /></label></div><label>성별<select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option>남성</option><option>여성</option></select></label><button className="primary submit">{editingId ? '저장하기' : '등록하기'}</button></form></div>}
  </div>;
}
export default App;
