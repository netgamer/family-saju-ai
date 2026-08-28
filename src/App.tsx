import { useState } from 'react';

type Member = { id: string; name: string; role: string; birthDate: string; birthTime: string; gender: string };

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '아빠', birthDate: '', birthTime: '', gender: '남성' });

  function addMember(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.birthDate || !form.birthTime) return;
    setMembers(prev => [...prev, { ...form, id: crypto.randomUUID() }]);
    setForm({ name: '', role: '아빠', birthDate: '', birthTime: '', gender: '남성' });
    setShowForm(false);
  }

  return <div className="app"><header className="topbar"><div className="brand"><span className="brand-mark">☯</span><div><strong>Family Saju AI</strong><small>가족을 이해하는 새로운 방법</small></div></div><span className="version">MVP 0.1</span></header><main className="shell"><section className="hero"><div><p className="eyebrow">FAMILY RELATIONSHIP</p><h1>사주를 보고,<br/><em>대화의 방법</em>을 찾습니다.</h1><p className="hero-copy">가족의 만세력을 저장하고, 두 사람의 관계와 상황을 바탕으로 AI가 실제 대화에 도움이 되는 방법을 안내합니다.</p></div><div className="hero-card"><span>현재 단계</span><strong>가족 정보 등록</strong><p>가족의 생년월일과 태어난 시각을 등록하면 만세력 프로필을 준비합니다.</p></div></section><section className="section"><div className="section-head"><div><p className="eyebrow">MY FAMILY</p><h2>가족 구성원</h2></div><button className="primary" onClick={() => setShowForm(true)}>＋ 가족 추가</button></div>{members.length === 0 ? <div className="empty"><div className="empty-icon">👨‍👩‍👧‍👦</div><h3>아직 가족이 등록되지 않았어요</h3><p>이름, 생년월일, 태어난 시각을 입력하면 만세력 프로필을 만들 수 있습니다.</p><button className="primary" onClick={() => setShowForm(true)}>첫 가족 등록하기</button></div> : <div className="members">{members.map(m => <div className="member" key={m.id}><span className="avatar">{m.role === '아빠' ? '👨' : m.role === '엄마' ? '👩' : m.role === '딸' ? '👧' : '👦'}</span><span><b>{m.name}</b><small>{m.role} · {m.birthDate} {m.birthTime}</small></span></div>)}</div>}</section><section className="section guide"><p className="eyebrow">AI CONVERSATION</p><h2>가족과 어떻게 이야기할까요?</h2><p>가족을 등록하면 두 사람의 사주와 관계를 바탕으로 대화 가이드를 만들 수 있습니다.</p><div className="flow"><span>① 나 선택</span><i>→</i><span>② 상대 선택</span><i>→</i><span>③ 상황 입력</span><i>→</i><strong>AI 대화 가이드</strong></div></section></main>{showForm && <div className="modal-backdrop" onMouseDown={() => setShowForm(false)}><form className="modal" onSubmit={addMember} onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">NEW MEMBER</p><h2>가족 등록</h2></div><button type="button" className="close" onClick={() => setShowForm(false)}>×</button></div><label>이름<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="예: 홍길동" required /></label><label>가족 관계<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>아빠</option><option>엄마</option><option>아들</option><option>딸</option><option>할아버지</option><option>할머니</option><option>기타</option></select></label><div className="row"><label>생년월일<input type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} required /></label><label>태어난 시각<input type="time" value={form.birthTime} onChange={e => setForm({ ...form, birthTime: e.target.value })} required /></label></div><label>성별<select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option>남성</option><option>여성</option></select></label><button className="primary submit">등록하기</button></form></div>}</div>;
}

export default App;
