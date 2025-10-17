import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LS = {
  precoMasc: 'antq_preco_masc',
  precoFem: 'antq_preco_fem',
  leilaoAberto: 'antq_leilao_aberto',
  adminKey: 'antq_admin_key',
  adminAuthed: 'antq_admin_authed',
  adminEmail: 'antq_admin_email',
}

function Box({ children, style }) {
  return <div style={{ background:'rgba(255,255,255,0.8)', border:'1px solid #E9C99E', borderRadius:16, padding:16, boxShadow:'0 4px 16px rgba(0,0,0,0.06)', ...style }}>{children}</div>
}
function H2({ children, right }) {
  return <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
    <h2 style={{ color:'#6B3E21', fontSize:18, fontWeight:700 }}>{children}</h2>{right}
  </div>
}
function Stat({ label, value }) {
  return <Box style={{ textAlign:'center' }}>
    <div style={{ color:'rgba(107,62,33,0.7)', fontSize:12, textTransform:'uppercase', letterSpacing:.4 }}>{label}</div>
    <div style={{ color:'#5d331a', fontSize:24, fontWeight:700, marginTop:4 }}>{value}</div>
  </Box>
}

// Gate simples
function AdminGate({ children }) {
  const [step, setStep] = useState('checking') // checking | setkey | login | ok
  const [email, setEmail] = useState('')
  const [key, setKey] = useState('')
  const [newKey, setNewKey] = useState('')
  const [confirmKey, setConfirmKey] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    const authed = localStorage.getItem(LS.adminAuthed) === 'true'
    const keyStored = localStorage.getItem(LS.adminKey)
    if (authed && keyStored) { setStep('ok'); return }
    if (keyStored) setStep('login'); else setStep('setkey')
  },[])

  const handleDefineKey = (e)=>{
    e.preventDefault()
    if (!newKey || newKey.length < 6) { setMsg('Defina uma chave com pelo menos 6 caracteres.'); return }
    if (newKey !== confirmKey) { setMsg('As chaves não coincidem.'); return }
    localStorage.setItem(LS.adminKey, newKey)
    setMsg('Chave definida. Faça login para continuar.')
    setStep('login')
  }
  const handleLogin = (e)=>{
    e.preventDefault()
    const keyStored = localStorage.getItem(LS.adminKey) || ''
    if (key && key === keyStored) {
      localStorage.setItem(LS.adminAuthed, 'true')
      localStorage.setItem(LS.adminEmail, email || 'admin@antiquario')
      setStep('ok')
    } else setMsg('Chave incorreta.')
  }
  const handleLogout = ()=>{ localStorage.removeItem(LS.adminAuthed); setStep('login') }

  if (step==='checking') return <div style={styles.screen}><div>Carregando…</div></div>
  if (step==='setkey') return <div style={styles.screen}>
    <Box style={{ maxWidth:420, width:'100%' }}>
      <h1 style={styles.h1}>Antiquário — Configurar chave</h1>
      <p style={{ color:'rgba(93,51,26,0.8)', fontSize:14, marginBottom:12 }}>Defina uma <b>chave de acesso</b> para o painel ADM. Compartilhe apenas com os sócios.</p>
      <form onSubmit={handleDefineKey} style={{ display:'grid', gap:8 }}>
        <input type='password' placeholder='Nova chave (mín. 6)' value={newKey} onChange={e=>setNewKey(e.target.value)} style={styles.input} />
        <input type='password' placeholder='Confirmar chave' value={confirmKey} onChange={e=>setConfirmKey(e.target.value)} style={styles.input} />
        {msg && <div style={{ color:'#b91c1c', fontSize:12 }}>{msg}</div>}
        <button style={styles.btnPrimary}>Salvar chave</button>
      </form>
    </Box>
  </div>
  if (step==='login') return <div style={styles.screen}>
    <Box style={{ maxWidth:420, width:'100%' }}>
      <h1 style={styles.h1}>Antiquário — ADM Login</h1>
      <form onSubmit={handleLogin} style={{ display:'grid', gap:8 }}>
        <input type='email' placeholder='Seu e‑mail' value={email} onChange={e=>setEmail(e.target.value)} style={styles.input} />
        <input type='password' placeholder='Chave de acesso' value={key} onChange={e=>setKey(e.target.value)} style={styles.input} />
        {msg && <div style={{ color:'#b91c1c', fontSize:12 }}>{msg}</div>}
        <button style={styles.btnPrimary}>Entrar</button>
      </form>
    </Box>
  </div>
  return <div style={{ position:'relative', minHeight:'100vh' }}>
    <button onClick={handleLogout} style={styles.btnGhost}>Sair</button>
    {children}
  </div>
}

export default function App(){
  const [leilaoAberto, setLeilaoAberto] = useState(false)
  const [precoMasc, setPrecoMasc] = useState(150)
  const [precoFem, setPrecoFem] = useState(70)
  const [toast, setToast] = useState('')

  const [pendentes, setPendentes] = useState([
    { id: 1, nome: 'Lucas Andrade', idade: 22, genero: 'masculino' },
    { id: 2, nome: 'Beatriz Lima', idade: 21, genero: 'feminino' },
  ])
  const [vendas, setVendas] = useState([
    { id: 1001, comprador: 'João Pereira', genero: 'masculino', valor: 150, metodo: 'PIX', quando: 'Hoje 19:42' },
    { id: 1002, comprador: 'Maria Souza', genero: 'feminino', valor: 70, metodo: 'Cartão', quando: 'Hoje 19:15' },
  ])

  useEffect(()=>{
    const m = parseFloat(localStorage.getItem(LS.precoMasc) || '')
    const f = parseFloat(localStorage.getItem(LS.precoFem) || '')
    const aberto = localStorage.getItem(LS.leilaoAberto)
    if (!isNaN(m)) setPrecoMasc(m)
    if (!isNaN(f)) setPrecoFem(f)
    if (aberto==='true') setLeilaoAberto(true)
  },[])

  function toggleLeilao(){ const novo=!leilaoAberto; setLeilaoAberto(novo); localStorage.setItem(LS.leilaoAberto, String(novo)) }
  function salvarValores(){ localStorage.setItem(LS.precoMasc, String(precoMasc)); localStorage.setItem(LS.precoFem, String(precoFem)); setToast('Valores do dia salvos'); setTimeout(()=>setToast(''),1500) }
  function enviarPush(){ alert("Push enviado: 'Leilão se inicia hoje no Antiquário às 23h00'") }
  function aprovar(id){ setPendentes(prev=>prev.filter(p=>p.id!==id)) }
  function negar(id){ setPendentes(prev=>prev.filter(p=>p.id!==id)) }

  const totalVendasHoje = vendas.reduce((s,v)=>s+(v.valor||0),0)
  const totalIngressosHoje = vendas.length

  return <AdminGate>
    <div style={styles.page}>
      <div style={{ maxWidth: 1100, width:'100%' }}>
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <h1 style={styles.title}>Antiquário — ADM</h1>
          <div style={{ color:'rgba(93,51,26,0.7)' }}>Painel de controle do leilão e operações</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:16 }}>
          <Stat label='Estado do leilão' value={leilaoAberto ? 'Aberto' : 'Fechado'} />
          <Stat label='Ingressos hoje' value={totalIngressosHoje} />
          <Stat label='Faturamento hoje' value={`R$ ${totalVendasHoje},00`} />
          <Stat label='Pendentes' value={pendentes.length} />
        </div>

        <Box style={{ marginBottom:16 }}>
          <H2 right={<div style={{ display:'flex', gap:8 }}>
            <button onClick={toggleLeilao} style={styles.btnPrimary}>{leilaoAberto ? 'Encerrar Leilão' : 'Abrir Leilão'}</button>
            <button onClick={enviarPush} style={styles.btnOutline}>Enviar Push</button>
          </div>}>Controle de Leilão</H2>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ color:'rgba(93,51,26,0.8)' }}>Status atual:</span>
            <span style={{ padding:'4px 10px', borderRadius:8, color:'white', fontWeight:700, background: leilaoAberto ? '#16a34a' : '#d97706' }}>{leilaoAberto ? 'Aberto' : 'Fechado'}</span>
          </div>
        </Box>

        <Box style={{ marginBottom:16 }}>
          <H2 right={toast && <span style={{ fontSize:12, color:'#065f46', background:'#d1fae5', border:'1px solid #6ee7b7', padding:'2px 8px', borderRadius:8 }}>{toast}</span>}>Definir valores do leilão (interno)</H2>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:12, alignItems:'end' }}>
            <div>
              <div style={{ color:'#6B3E21', fontSize:13, marginBottom:4 }}>Entrada Masculina (R$)</div>
              <input type='number' min={0} step={10} value={precoMasc} onChange={e=>setPrecoMasc(Number(e.target.value))} style={styles.input} />
            </div>
            <div>
              <div style={{ color:'#6B3E21', fontSize:13, marginBottom:4 }}>Entrada Feminina (R$)</div>
              <input type='number' min={0} step={10} value={precoFem} onChange={e=>setPrecoFem(Number(e.target.value))} style={styles.input} />
            </div>
            <button onClick={salvarValores} style={styles.btnPrimary}>Salvar valores do dia</button>
          </div>
          <div style={{ color:'rgba(93,51,26,0.7)', fontSize:12, marginTop:6 }}>Os valores ficam visíveis ao cliente somente na hora do lance, conforme o gênero cadastrado.</div>
        </Box>

        <Box style={{ marginBottom:16 }}>
          <H2>Usuários pendentes de aprovação</H2>
          <AnimatePresence>
            {pendentes.length===0 ? (
              <div style={{ color:'rgba(93,51,26,0.7)', fontStyle:'italic' }}>Nenhum usuário pendente 🎉</div>
            ) : (
              <div style={{ display:'grid', gap:8 }}>
                {pendentes.map(p => (
                  <motion.div key={p.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
                    style={{ display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #E9C99E', background:'rgba(255,255,255,0.7)', borderRadius:12, padding:12 }}>
                    <div>
                      <div style={{ color:'#5d331a', fontWeight:600 }}>{p.nome}</div>
                      <div style={{ color:'rgba(93,51,26,0.7)', fontSize:13 }}>{p.idade} anos · {p.genero}</div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>aprovar(p.id)} style={{ ...styles.btnSmall, background:'#16a34a', color:'white' }}>Aprovar</button>
                      <button onClick={()=>negar(p.id)} style={{ ...styles.btnSmall, background:'#ef4444', color:'white' }}>Negar</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </Box>

        <Box>
          <H2>Vendas recentes</H2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))', gap:12 }}>
            {vendas.map(v => (
              <motion.div key={v.id} initial={{ opacity:0, scale:0.96 }} animate={{ opacity:1, scale:1 }}
                style={{ border:'1px solid #E9C99E', background:'rgba(255,255,255,0.8)', borderRadius:12, padding:12 }}>
                <div style={{ color:'#5d331a', fontWeight:600 }}>{v.comprador}</div>
                <div style={{ color:'rgba(93,51,26,0.7)', fontSize:13, marginBottom:6 }}>{v.genero} · {v.metodo} · {v.quando}</div>
                <div style={{ color:'#5d331a', fontWeight:700 }}>R$ {v.valor},00</div>
              </motion.div>
            ))}
          </div>
        </Box>

        <div style={{ textAlign:'center', color:'rgba(93,51,26,0.6)', fontSize:12, marginTop:24 }}>Antiquário · Painel Administrativo</div>
      </div>
    </div>
  </AdminGate>
}

const styles = {
  page: { minHeight:'100vh', background:'#F5E6D3', display:'flex', justifyContent:'center', padding:24 },
  title: { fontFamily:'serif', fontStyle:'italic', fontSize:40, color:'#5d331a', margin:0 },
  h1: { fontFamily:'serif', fontStyle:'italic', fontSize:24, color:'#5d331a', margin:'0 0 12px 0' },
  input: { width:'100%', padding:'10px 12px', borderRadius:12, border:'1px solid #E9C99E', background:'rgba(255,255,255,0.9)' },
  btnPrimary: { padding:'10px 14px', borderRadius:12, border:'none', background:'#C98E63', color:'white', fontWeight:700, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.08)' },
  btnOutline: { padding:'10px 14px', borderRadius:12, border:'1px solid #E9C99E', background:'white', color:'#5d331a', fontWeight:600, cursor:'pointer' },
  btnGhost: { position:'fixed', right:16, top:16, border:'1px solid #E9C99E', background:'white', color:'#5d331a', borderRadius:10, padding:'6px 10px', cursor:'pointer' },
  btnSmall: { padding:'8px 10px', borderRadius:10, border:'none', cursor:'pointer', fontWeight:700 }
}
