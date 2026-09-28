(() => {
'use strict';

/* =========================================================
   VIBELY - SOCIAL NETWORK
   ========================================================= */

const KEY = 'vibely_db_v1';
const SKEY = 'vibely_session';
const TKEY = 'vibely_theme';

const PALETTE = [
  '#0E8F7E',
  '#3D5AFE',
  '#C2410C',
  '#9333EA',
  '#BE185D',
  '#0369A1',
  '#4D7C0F',
  '#B45309'
];

const CANNED = [
  'Haha, exactly!',
  'Sounds good to me 👍',
  'Tell me more?',
  'That made my day.',
  'Let’s catch up soon.',
  'I was just thinking the same thing.',
  'Send me the details later?',
  'Nice, count me in.'
];

const app = document.getElementById('app');

const $ = (s, r = document) => r.querySelector(s);

const esc = s =>
  String(s ?? '').replace(/[&<>"']/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));

const uid = () =>
  Math.random().toString(36).slice(2, 10) +
  Date.now().toString(36).slice(-4);

const now = () => Date.now();

const ICONS = {

  home:
  'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',

  users:
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',

  bell:
  'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',

  chat:
  'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',

  bookmark:
  'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z',

  user:
  'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',

  settings:
  'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',

  heart:
  'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z',

  image:
  'M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',

  search:
  'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',

  trash:
  'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6',

  edit:
  'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',

  send:
  'M22 2L11 13M22 2l-7 20-4-9-9-4z',

  moon:
  'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',

  sun:
  'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',

  logout:
  'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',

  globe:
  'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20',

  lock:
  'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4',

  check:
  'M20 6L9 17l-5-5',

  x:
  'M18 6L6 18M6 6l12 12',

  share:
  'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',

  back:
  'M19 12H5M12 19l-7-7 7-7'
};

const ic = n =>
  `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d="${ICONS[n] || ''}"></path>
  </svg>`;


/* =========================================================
   STATE
   ========================================================= */

let db = null;
let session = localStorage.getItem(SKEY);

const state = {
  tab:'friends',
  limit:10,
  openC:new Set(),
  draft:{
    text:'',
    img:'',
    privacy:null
  },
  authTab:'login',
  pq:'',
  lastRoute:''
};


/* =========================================================
   STORAGE
   ========================================================= */

async function hash(p){

  try{

    const b = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode('vibely:' + p)
    );

    return [...new Uint8Array(b)]
      .map(x => x.toString(16).padStart(2,'0'))
      .join('');

  }catch(e){

    let h = 5381;

    for(const c of p){
      h = ((h << 5) + h + c.charCodeAt(0)) | 0;
    }

    return 'x' + h;
  }
}


function persist(){

  try{

    localStorage.setItem(KEY, JSON.stringify(db));
    return true;

  }catch(e){

    toast(
      'Storage is full. Delete some photos or posts and try again.',
      'error'
    );

    return false;
  }
}


function reload(){

  try{

    const r = localStorage.getItem(KEY);

    if(r){
      db = JSON.parse(r);
    }

  }catch(e){}
}


/* =========================================================
   SEED DATA
   ========================================================= */

async function seed(){

  const pw = await hash('demo1234');

  const t = now();
  const m = 60000;
  const h = 60 * m;
  const d = 24 * h;

  const mk = (
    id,
    name,
    handle,
    bio,
    ci,
    extra = {}
  ) => ({
    id,
    name,
    handle,
    email:handle + '@vibely.app',
    pass:pw,
    bio,
    avatar:'',
    color:PALETTE[ci],
    cover:PALETTE[(ci + 3) % 8],
    profilePrivacy:'public',
    postPrivacy:'public',
    createdAt:t - 30 * d,
    bot:true,
    ...extra
  });

  const users = [

    mk(
      'u_demo',
      'Demo User',
      'demo',
      'Trying out Vibely. Ask me anything.',
      0,
      {bot:false}
    ),

    mk(
      'u_ayesha',
      'Ayesha Khan',
      'ayesha',
      'Photographer. Chai enthusiast. Margalla regular.',
      1
    ),

    mk(
      'u_bilal',
      'Bilal Ahmed',
      'bilal',
      'Frontend dev. Cricket on weekends.',
      2,
      {postPrivacy:'friends'}
    ),

    mk(
      'u_hina',
      'Hina Malik',
      'hina',
      'Books, tea, long walks.',
      4
    ),

    mk(
      'u_usman',
      'Usman Tariq',
      'usman',
      'Backend engineer. Opinions on READMEs.',
      5
    )
  ];

  const posts = [

    {
      id:'p1',
      uid:'u_ayesha',
      text:'Sunday walk through Margalla Hills. Fog, chai, and zero notifications. #margalla #weekend',
      img:'',
      privacy:'public',
      ts:t - 2 * h,
      likes:['u_demo','u_bilal'],
      comments:[
        {
          id:'c1',
          uid:'u_bilal',
          text:'Take me next time!',
          ts:t - 90 * m
        }
      ]
    },

    {
      id:'p2',
      uid:'u_bilal',
      text:'Finally shipped the new dashboard at work. Two weeks of bugs in one merge. #coding',
      img:'',
      privacy:'friends',
      ts:t - 5 * h,
      likes:['u_ayesha'],
      comments:[]
    },

    {
      id:'p3',
      uid:'u_hina',
      text:'Reading recommendations for the long weekend? Currently on a Manto short story collection. #books',
      img:'',
      privacy:'public',
      ts:t - 9 * h,
      likes:[],
      comments:[]
    },

    {
      id:'p4',
      uid:'u_usman',
      text:'Hot take: a good README is worth more than a clever architecture. #coding #devlife',
      img:'',
      privacy:'public',
      ts:t - 1 * d,
      likes:['u_bilal','u_hina'],
      comments:[
        {
          id:'c2',
          uid:'u_hina',
          text:'Agreed. Docs are a feature.',
          ts:t - 20 * h
        }
      ]
    },

    {
      id:'p5',
      uid:'u_ayesha',
      text:'Chai or coffee? Be honest. #chai',
      img:'',
      privacy:'public',
      ts:t - 2 * d,
      likes:['u_demo'],
      comments:[]
    },

    {
      id:'p6',
      uid:'u_demo',
      text:'Welcome to Vibely, a small place for your actual friends. Try liking a post, leaving a comment, or messaging Ayesha. #welcome',
      img:'',
      privacy:'public',
      ts:t - 3 * h,
      likes:['u_bilal'],
      comments:[]
    }
  ];

  return {

    users,

    posts,

    friends:[
      {a:'u_demo',b:'u_ayesha'},
      {a:'u_demo',b:'u_bilal'},
      {a:'u_ayesha',b:'u_bilal'},
      {a:'u_ayesha',b:'u_hina'}
    ],

    requests:[
      {
        id:'r1',
        from:'u_hina',
        to:'u_demo',
        ts:t - 40 * m
      }
    ],

    notifs:[
      {
        id:'n1',
        to:'u_demo',
        type:'request',
        from:'u_hina',
        ts:t - 40 * m,
        read:false
      },
      {
        id:'n2',
        to:'u_demo',
        type:'like',
        from:'u_bilal',
        postId:'p6',
        ts:t - 2 * h,
        read:false
      }
    ],

    messages:[
      {
        id:'m1',
        from:'u_ayesha',
        to:'u_demo',
        text:'Welcome aboard! Did you see my Margalla photos?',
        ts:t - 30 * m,
        read:false
      }
    ],

    saved:{}
  };
}


/* =========================================================
   SELECTORS
   ========================================================= */

const me = () =>
  db && db.users.find(u => u.id === session);

const user = id =>
  db.users.find(u => u.id === id) ||
  {
    id,
    name:'Deleted user',
    handle:'deleted',
    color:'#888',
    avatar:''
  };

const byHandle = h =>
  db.users.find(
    u => u.handle === String(h || '').toLowerCase()
  );

const areFriends = (a,b) =>
  db.friends.some(
    f =>
      (f.a === a && f.b === b) ||
      (f.a === b && f.b === a)
  );

const friendIds = id =>
  db.friends
    .filter(f => f.a === id || f.b === id)
    .map(f => f.a === id ? f.b : f.a);

const reqBetween = (a,b) =>
  db.requests.find(
    r =>
      (r.from === a && r.to === b) ||
      (r.from === b && r.to === a)
  );

const incoming = () =>
  db.requests.filter(r => r.to === session);

const canSeePost = (p,v) =>
  p.uid === v ||
  p.privacy === 'public' ||
  (p.privacy === 'friends' && areFriends(p.uid,v));

const canViewProfile = (u,v) =>
  u.id === v ||
  u.profilePrivacy === 'public' ||
  (u.profilePrivacy === 'friends' && areFriends(u.id,v));

const unreadNotifs = () =>
  db.notifs.filter(
    n => n.to === session && !n.read
  ).length;

const unreadMsgs = () =>
  db.messages.filter(
    m => m.to === session && !m.read
  ).length;

const initials = n =>
  String(n || '?')
    .trim()
    .split(/\s+/)
    .slice(0,2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

const mutuals = (a,b) =>
  friendIds(a).filter(
    x => friendIds(b).includes(x)
  ).length;

const savedList = () =>
  db.saved[session] ||
  (db.saved[session] = []);


/* =========================================================
   HELPERS
   ========================================================= */

function ago(ts){

  const s = Math.max(
    1,
    Math.floor((now() - ts) / 1000)
  );

  if(s < 60) return 'just now';

  if(s < 3600)
    return Math.floor(s / 60) + 'm';

  if(s < 86400)
    return Math.floor(s / 3600) + 'h';

  if(s < 604800)
    return Math.floor(s / 86400) + 'd';

  return new Date(ts).toLocaleDateString(
    undefined,
    {
      month:'short',
      day:'numeric'
    }
  );
}


function notify(to,type,from,extra = {}){

  if(to === from) return;

  if(
    type === 'like' &&
    db.notifs.some(
      n =>
        n.type === 'like' &&
        n.to === to &&
        n.from === from &&
        n.postId === extra.postId
    )
  ){
    return;
  }

  db.notifs.unshift({
    id:uid(),
    to,
    type,
    from,
    ts:now(),
    read:false,
    ...extra
  });
}


function rich(text){

  return esc(text).replace(
    /(https?:\/\/[^\s<]+)|(#[\p{L}\p{N}_]{2,30})|(@[a-z0-9_]{3,20})/giu,
    (m,url,tag,men) => {

      if(url){
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
      }

      if(tag){
        return `<a href="#/tag/${encodeURIComponent(tag.slice(1).toLowerCase())}">${tag}</a>`;
      }

      if(men){
        return byHandle(men.slice(1))
          ? `<a href="#/u/${men.slice(1).toLowerCase()}">${men}</a>`
          : m;
      }

      return m;
    }
  );
}


function fileToDataURL(file,max,q = 0.82){

  return new Promise((res,rej) => {

    if(
      !file ||
      !file.type.startsWith('image/')
    ){
      return rej(
        new Error('Please choose an image file.')
      );
    }

    const fr = new FileReader();

    fr.onerror = () =>
      rej(new Error('Could not read that file.'));

    fr.onload = () => {

      const img = new Image();

      img.onerror = () =>
        rej(new Error('That image could not be opened.'));

      img.onload = () => {

        const s = Math.min(
          1,
          max / Math.max(img.width,img.height)
        );

        const c = document.createElement('canvas');

        c.width = Math.round(img.width * s);
        c.height = Math.round(img.height * s);

        const x = c.getContext('2d');

        x.fillStyle = '#fff';
        x.fillRect(0,0,c.width,c.height);

        x.drawImage(
          img,
          0,
          0,
          c.width,
          c.height
        );

        res(
          c.toDataURL(
            'image/jpeg',
            q
          )
        );
      };

      img.src = fr.result;
    };

    fr.readAsDataURL(file);
  });
}


/* =========================================================
   UI HELPERS
   ========================================================= */

function toast(msg,kind = ''){

  const el = document.createElement('div');

  el.className = 'toast ' + kind;
  el.textContent = msg;

  $('#toasts').appendChild(el);

  setTimeout(
    () => el.remove(),
    2800
  );
}


function openModal(html,cls = ''){

  $('#modal-root').innerHTML =
    `<div class="modal-bg" data-act="closeModalBg">
      <div class="modal ${cls}" role="dialog" aria-modal="true">
        ${html}
      </div>
    </div>`;
}


function closeModal(){

  $('#modal-root').innerHTML = '';
}


function avatar(u,s = 40){

  const st =
    `width:${s}px;height:${s}px;font-size:${Math.round(s*.38)}px`;

  if(u.avatar){

    return `
      <span class="av" style="${st}">
        <img src="${u.avatar}" alt="">
      </span>`;
  }

  return `
    <span class="av"
      style="${st};background:${esc(u.color)}">
      ${esc(initials(u.name))}
    </span>`;
}


const privIcon = p =>
  p === 'public'
    ? ic('globe') + 'Public'
    : p === 'friends'
      ? ic('users') + 'Friends'
      : ic('lock') + 'Only me';


const privSelect = (id,val) => `
<select id="${id}" aria-label="Who can see this">
  <option value="public"
    ${val === 'public' ? 'selected' : ''}>
    Public
  </option>

  <option value="friends"
    ${val === 'friends' ? 'selected' : ''}>
    Friends
  </option>

  <option value="me"
    ${val === 'me' ? 'selected' : ''}>
    Only me
  </option>
</select>`;


const empty = (t,s) =>
  `<div class="empty">
    <b>${t}</b>
    ${s}
  </div>`;


/* =========================================================
   ROUTING
   ========================================================= */

function route(){

  const h =
    location.hash.replace(/^#\/?/,''); 

  const [name,...rest] =
    h.split('/');

  let arg = rest.join('/');

  try{
    arg = decodeURIComponent(arg);
  }catch(e){}

  return {
    name:name || 'home',
    arg
  };
}


window.addEventListener(
  'hashchange',
  () => {

    state.limit = 10;

    closeModal();

    render();

    window.scrollTo(0,0);
  }
);


/* =========================================================
   AUTH
   ========================================================= */

function renderAuth(){

  const login =
    state.authTab === 'login';

  app.innerHTML = `

  <div class="auth">

    <section class="hero">

      <div class="logo">
        <span class="logo-mark">V</span>
        Vibely
      </div>

      <div>
       

        <p>
          Post to the people you choose, message friends,
          and keep your circle small enough to know.
        </p>
      </div>

      <ul>

        <li>
          ${ic('users')}
          Friend requests, not followers
        </li>

        <li>
          ${ic('lock')}
          Public, friends, or only-me on every post
        </li>

        <li>
          ${ic('chat')}
          Private messages with your friends
        </li>

      </ul>

    </section>

    <section class="authwrap">

      <div class="authcard">

        <div class="tabs" role="tablist">

          <button
            class="${login ? 'on' : ''}"
            data-act="authTab"
            data-t="login">
            Log in
          </button>

          <button
            class="${!login ? 'on' : ''}"
            data-act="authTab"
            data-t="signup">
            Create account
          </button>

        </div>

        <h2>
          ${login ? 'Welcome back' : 'Join Vibely'}
        </h2>

        <p>
          ${
            login
              ? 'Log in to see what your friends are up to.'
              : 'It takes less than a minute.'
          }
        </p>

        <div
          class="err"
          id="authErr"
          role="alert">
        </div>

        ${
          login

          ? `

          <form data-form="login">

            <div class="field">

              <label for="l_id">
                Email or username
              </label>

              <input
                id="l_id"
                name="id"
                type="text"
                autocomplete="username"
                required>

            </div>

            <div class="field">

              <label for="l_pw">
                Password
              </label>

              <input
                id="l_pw"
                name="pw"
                type="password"
                autocomplete="current-password"
                required>

            </div>

            <button
              class="btn primary"
              style="width:100%">
              Log in
            </button>

          </form>

          <div class="demo">

            Just exploring?

            <button data-act="demoLogin">
              Log in as the demo user
            </button>

          </div>

          `

          :

          `

          <form data-form="signup">

            <div class="field">

              <label for="s_name">
                Full name
              </label>

              <input
                id="s_name"
                name="name"
                type="text"
                maxlength="40"
                required>

            </div>

            <div class="field">

              <label for="s_h">
                Username
              </label>

              <input
                id="s_h"
                name="handle"
                type="text"
                maxlength="20"
                placeholder="letters, numbers, underscore"
                required>

              <small>
                3–20 characters.
                This is how friends find you.
              </small>

            </div>

            <div class="field">

              <label for="s_e">
                Email
              </label>

              <input
                id="s_e"
                name="email"
                type="email"
                autocomplete="email"
                required>

            </div>

            <div class="field">

              <label for="s_p">
                Password
              </label>

              <input
                id="s_p"
                name="pw"
                type="password"
                minlength="6"
                autocomplete="new-password"
                required>

              <small>
                At least 6 characters.
              </small>

            </div>

            <button
              class="btn primary"
              style="width:100%">
              Create account
            </button>

          </form>

          `
        }

      </div>

    </section>

  </div>`;
}


const authErr = m => {

  const e = $('#authErr');

  if(e){
    e.textContent = m;
  }
};


/* =========================================================
   MAIN RENDER
   ========================================================= */

function render(){

  if(!db) return;

  if(!session || !me()){

    session = null;

    renderAuth();

    return;
  }

  const r = route();
  const u = me();

  const key =
    r.name + '/' + r.arg;

  const y =
    key === state.lastRoute
      ? window.scrollY
      : 0;

  state.lastRoute = key;

  let view = '';
  let cur = null;

  if(
    r.name === 'messages' &&
    r.arg
  ){

    cur = byHandle(r.arg);

    if(
      cur &&
      areFriends(u.id,cur.id)
    ){

      let ch = false;

      db.messages.forEach(m => {

        if(
          m.from === cur.id &&
          m.to === u.id &&
          !m.read
        ){

          m.read = true;
          ch = true;
        }

      });

      if(ch) persist();

    }else{

      cur = null;
    }
  }

  switch(r.name){

    case 'friends':
      view = friendsView();
      break;

    case 'messages':
      view = messagesView(cur);
      break;

    case 'notifications':
      view = notificationsView();
      break;

    case 'saved':
      view = savedView();
      break;

    case 'u':
      view = profileView(r.arg);
      break;

    case 'settings':
      view = settingsView();
      break;

    case 'search':
      view = searchView(r.arg);
      break;

    case 'tag':
      view = tagView(r.arg);
      break;

    case 'post':
      view = postView(r.arg);
      break;

    default:
      view = homeView();
  }

  const un = unreadNotifs();
  const um = unreadMsgs();
  const pr = incoming().length;

  const dark =
    document.documentElement.dataset.theme === 'dark';

  const nav = (
    href,
    icon,
    label,
    on,
    badge
  ) => `

    <a
      class="nav ${on ? 'on' : ''}"
      href="${href}"
      ${on ? 'aria-current="page"' : ''}>

      ${ic(icon)}

      <span>
        ${label}
      </span>

      ${
        badge
          ? `<i class="badge">${badge}</i>`
          : ''
      }

    </a>`;

  const isProfileMe =
    r.name === 'u' &&
    r.arg.toLowerCase() === u.handle;

  const tab = (
    href,
    icon,
    on,
    badge
  ) => `

    <a
      href="${href}"
      class="${on ? 'on' : ''}"
      aria-label="${icon}">

      ${ic(icon)}

      ${
        badge
          ? `<i class="badge">${badge}</i>`
          : ''
      }

    </a>`;

  const wide =
    r.name === 'messages';

  app.innerHTML = `

  <div class="shell ${wide ? 'wide' : ''}">

    <aside class="rail">

      <a class="brand" href="#/home">

        <span class="logo-mark">
          V
        </span>

        <span>
          Vibely
        </span>

      </a>

      ${nav(
        '#/home',
        'home',
        'Home',
        r.name === 'home' ||
        r.name === 'post' ||
        r.name === 'tag'
      )}

      ${nav(
        '#/friends',
        'users',
        'Friends',
        r.name === 'friends',
        pr
      )}

      ${nav(
        '#/messages',
        'chat',
        'Messages',
        r.name === 'messages',
        um
      )}

      ${nav(
        '#/notifications',
        'bell',
        'Notifications',
        r.name === 'notifications',
        un
      )}

      ${nav(
        '#/saved',
        'bookmark',
        'Saved',
        r.name === 'saved'
      )}

      ${nav(
        '#/u/' + u.handle,
        'user',
        'Profile',
        isProfileMe
      )}

      ${nav(
        '#/settings',
        'settings',
        'Settings',
        r.name === 'settings'
      )}

      <div class="spacer"></div>

      <div class="me-card">

        ${avatar(u,38)}

        <div class="who">

          <b>
            ${esc(u.name)}
          </b>

          <span>
            @${esc(u.handle)}
          </span>

        </div>

        <button
          class="icon-btn"
          data-act="theme"
          title="Switch theme"
          aria-label="Switch theme">

          ${ic(dark ? 'sun' : 'moon')}

        </button>

        <button
          class="icon-btn"
          data-act="logout"
          title="Log out"
          aria-label="Log out">

          ${ic('logout')}

        </button>

      </div>

    </aside>

    <main
      class="main"
      id="main">

      ${
        wide
          ? ''
          : `
          <form
            class="searchbar"
            data-form="search"
            role="search">

            ${ic('search')}

            <input
              type="search"
              name="q"
              placeholder="Search people, posts, #tags"
              value="${
                r.name === 'search'
                  ? esc(r.arg)
                  : ''
              }"
              aria-label="Search">

          </form>`
      }

      ${view}

    </main>

    ${
      wide
        ? ''
        : `
        <aside class="side">

          ${sideRequests()}

          ${sideSuggestions()}

          ${sideTrending()}

        </aside>`
    }

  </div>

  <nav class="tabbar">

    ${tab(
      '#/home',
      'home',
      r.name === 'home'
    )}

    ${tab(
      '#/friends',
      'users',
      r.name === 'friends',
      pr
    )}

    ${tab(
      '#/messages',
      'chat',
      r.name === 'messages',
      um
    )}

    ${tab(
      '#/notifications',
      'bell',
      r.name === 'notifications',
      un
    )}

    ${tab(
      '#/u/' + u.handle,
      'user',
      isProfileMe
    )}

  </nav>`;

  if(wide){

    const m = $('#msgs');

    if(m){
      m.scrollTop = m.scrollHeight;
    }
  }

  window.scrollTo(0,y);
}


/* =========================================================
   SIDE WIDGETS
   ========================================================= */

function sideRequests(){

  const rs = incoming();

  if(!rs.length) return '';

  return `

  <section class="card pad">

    <h3>
      Friend requests
    </h3>

    ${
      rs.map(r => {

        const x = user(r.from);

        return `

        <div class="urow">

          ${avatar(x,40)}

          <div class="info">

            <a href="#/u/${esc(x.handle)}">
              ${esc(x.name)}
            </a>

            <span>
              @${esc(x.handle)}
            </span>

          </div>

          <div class="btns">

            <button
              class="btn primary sm"
              data-act="accept"
              data-id="${x.id}">
              Accept
            </button>

            <button
              class="btn ghost sm"
              data-act="decline"
              data-id="${x.id}">
              Decline
            </button>

          </div>

        </div>`;
      }).join('')
    }

  </section>`;
}


function suggestions(){

  const u = me();

  return db.users
    .filter(
      x =>
        x.id !== u.id &&
        !areFriends(u.id,x.id) &&
        !reqBetween(u.id,x.id)
    )
    .map(
      x => ({
        x,
        m:mutuals(u.id,x.id)
      })
    )
    .sort(
      (a,b) => b.m - a.m
    );
}


function sideSuggestions(){

  const s =
    suggestions().slice(0,4);

  if(!s.length) return '';

  return `

  <section class="card pad">

    <h3>
      People you may know
    </h3>

    ${
      s.map(({x,m}) => `

        <div class="urow">

          ${avatar(x,40)}

          <div class="info">

            <a href="#/u/${esc(x.handle)}">
              ${esc(x.name)}
            </a>

            <span>
              ${
                m
                  ? m +
                    ' mutual friend' +
                    (m > 1 ? 's' : '')
                  : '@' + esc(x.handle)
              }
            </span>

          </div>

          <div class="btns">

            <button
              class="btn ghost sm"
              data-act="addFriend"
              data-id="${x.id}">
              Add
            </button>

          </div>

        </div>

      `).join('')
    }

  </section>`;
}


function sideTrending(){

  const u = me();

  const cutoff =
    now() - 7 * 864e5;

  const map = {};

  db.posts
    .filter(
      p =>
        p.ts > cutoff &&
        canSeePost(p,u.id)
    )
    .forEach(p => {

      (
        p.text.match(
          /#[\p{L}\p{N}_]{2,30}/gu
        ) || []
      ).forEach(t => {

        const k =
          t.slice(1).toLowerCase();

        map[k] =
          (map[k] || 0) + 1;

      });

    });

  const top =
    Object.entries(map)
      .sort((a,b) => b[1] - a[1])
      .slice(0,6);

  if(!top.length) return '';

  return `

  <section class="card pad">

    <h3>
      Trending this week
    </h3>

    ${
      top.map(([t,n]) => `

        <a
          class="tag"
          href="#/tag/${encodeURIComponent(t)}">

          <b>
            #${esc(t)}
          </b>

          <span>
            ${n}
            post${n > 1 ? 's' : ''}
          </span>

        </a>

      `).join('')
    }

  </section>`;
}


/* =========================================================
   POSTS
   ========================================================= */

function commentsHTML(p){

  const u = me();

  return `

  <div class="comments">

    ${
      p.comments.map(c => {

        const a = user(c.uid);

        return `

        <div class="comment">

          <a href="#/u/${esc(a.handle)}">
            ${avatar(a,32)}
          </a>

          <div>

            <div class="bub">

              <b>
                ${esc(a.name)}
              </b>

              <p>
                ${rich(c.text)}
              </p>

            </div>

            <div class="t">

              <span>
                ${ago(c.ts)}
              </span>

              ${
                (
                  c.uid === u.id ||
                  p.uid === u.id
                )

                ? `

                  <button
                    data-act="delComment"
                    data-id="${p.id}"
                    data-c="${c.id}">
                    Delete
                  </button>`

                : ''
              }

            </div>

          </div>

        </div>`;
      }).join('')
    }

    <div class="cform">

      ${avatar(u,32)}

      <input
        type="text"
        data-cin="${p.id}"
        placeholder="Write a comment…"
        maxlength="500"
        aria-label="Write a comment">

      <button
        class="icon-btn"
        data-act="addComment"
        data-id="${p.id}"
        aria-label="Send comment">

        ${ic('send')}

      </button>

    </div>

  </div>`;
}


function postHTML(p){

  const u = me();
  const a = user(p.uid);

  const liked =
    p.likes.includes(u.id);

  const saved =
    savedList().includes(p.id);

  const open =
    state.openC.has(p.id);

  return `

  <article
    class="card post"
    data-post="${p.id}">

    <header>

      <a href="#/u/${esc(a.handle)}">
        ${avatar(a,44)}
      </a>

      <div class="meta">

        <a
          class="name"
          href="#/u/${esc(a.handle)}">

          ${esc(a.name)}

        </a>

        <div class="sub">

          <span>
            @${esc(a.handle)}
          </span>

          <span>·</span>

          <a href="#/post/${p.id}">
            ${ago(p.ts)}
            ${p.edited ? ' (edited)' : ''}
          </a>

          <span>·</span>

          ${privIcon(p.privacy)}

        </div>

      </div>

      ${
        p.uid === u.id

        ? `

          <button
            class="icon-btn"
            data-act="editPost"
            data-id="${p.id}"
            aria-label="Edit post">

            ${ic('edit')}

          </button>

          <button
            class="icon-btn"
            data-act="delPost"
            data-id="${p.id}"
            aria-label="Delete post">

            ${ic('trash')}

          </button>`

        : ''
      }

    </header>

    ${
      p.text
        ? `<div class="body">${rich(p.text)}</div>`
        : ''
    }

    ${
      p.img

        ? `

          <img
            class="pimg"
            src="${p.img}"
            alt="Photo shared by ${esc(a.name)}"
            data-act="lightbox">`

        : ''
    }

    <div class="acts">

      <button
        class="act like ${liked ? 'on' : ''}"
        data-act="like"
        data-id="${p.id}"
        aria-pressed="${liked}">

        ${ic('heart')}

        ${p.likes.length || ''}

        <span class="sr">
          ${liked ? 'Unlike' : 'Like'}
        </span>

      </button>

      <button
        class="act"
        data-act="toggleC"
        data-id="${p.id}"
        aria-expanded="${open}">

        ${ic('chat')}

        ${p.comments.length || ''}

      </button>

      <button
        class="act"
        data-act="share"
        data-id="${p.id}">

        ${ic('share')}

      </button>

      <button
        class="act save end ${saved ? 'on' : ''}"
        data-act="save"
        data-id="${p.id}"
        aria-pressed="${saved}">

        ${ic('bookmark')}

      </button>

    </div>

    ${
      open
        ? commentsHTML(p)
        : ''
    }

  </article>`;
}


function refreshPost(id,focusC){

  const p =
    db.posts.find(x => x.id === id);

  const el =
    document.querySelector(
      `[data-post="${id}"]`
    );

  if(!p || !el){

    render();

    return;
  }

  el.outerHTML =
    postHTML(p);

  if(focusC){

    const i =
      document.querySelector(
        `[data-cin="${id}"]`
      );

    if(i){
      i.focus();
    }
  }
}


const feedList = (
  posts,
  emptyMsg
) => {

  const list =
    posts
      .slice()
      .sort(
        (a,b) => b.ts - a.ts
      );

  const shown =
    list.slice(
      0,
      state.limit
    );

  return shown.length

    ? shown.map(postHTML).join('') +

      (
        list.length > shown.length

        ? `

          <div
            style="text-align:center;margin:10px 0">

            <button
              class="btn ghost"
              data-act="more">

              Show more posts

            </button>

          </div>`

        : ''
      )

    : `<div class="card">${emptyMsg}</div>`;
};


/* =========================================================
   COMPOSER
   ========================================================= */

function composer(){

  const u = me();

  const d = state.draft;

  const priv =
    d.privacy ||
    u.postPrivacy;

  return `

  <section class="card composer">

    <div class="row top">

      ${avatar(u,44)}

      <textarea
        id="cText"
        rows="2"
        maxlength="1000"
        placeholder="What’s on your mind, ${esc(u.name.split(' ')[0])}?"
        aria-label="Write a post">${esc(d.text)}</textarea>

    </div>

    ${
      d.img

        ? `

          <div class="prev">

            <img
              src="${d.img}"
              alt="Photo to post">

            <button
              class="x"
              data-act="rmImg"
              aria-label="Remove photo">

              ${ic('x')}

            </button>

          </div>`

        : ''
    }

    <div class="bar">

      <div class="row gap">

        <label
          class="btn ghost sm"
          style="cursor:pointer">

          ${ic('image')}
          Photo

          <input
            type="file"
            id="cFile"
            accept="image/*"
            hidden>

        </label>

        ${privSelect('cPriv',priv)}

      </div>

      <div class="row gap">

        <span
          class="count"
          id="cCount">

          ${d.text.length}/1000

        </span>

        <button
          class="btn primary"
          data-act="post">

          Post

        </button>

      </div>

    </div>

  </section>`;
}


/* =========================================================
   VIEWS
   ========================================================= */

function homeView(){

  const u = me();

  const t = state.tab;

  const posts =
    t === 'friends'

      ? db.posts.filter(
          p =>
            (
              p.uid === u.id ||
              areFriends(u.id,p.uid)
            ) &&
            canSeePost(p,u.id)
        )

      : db.posts.filter(
          p => p.privacy === 'public'
        );

  const msg =
    t === 'friends'

      ? empty(
          'Your feed is quiet',
          'Add a few friends or write the first post.'
        )

      : empty(
          'Nothing public yet',
          'Public posts from everyone show up here.'
        );

  return `

    ${composer()}

    <div class="seg">

      <button
        class="${t === 'friends' ? 'on' : ''}"
        data-act="feedTab"
        data-t="friends">

        Friends

      </button>

      <button
        class="${t === 'discover' ? 'on' : ''}"
        data-act="feedTab"
        data-t="discover">

        Discover

      </button>

    </div>

    ${feedList(posts,msg)}

  `;
}


function postView(id){

  const p =
    db.posts.find(x => x.id === id);

  if(
    !p ||
    !canSeePost(p,session)
  ){

    return `

      <div class="page-title">

        <a
          class="icon-btn"
          href="#/home"
          aria-label="Back">

          ${ic('back')}

        </a>

        Post

      </div>

      <div class="card">

        ${empty(
          'This post isn’t available',
          'It may have been deleted, or its owner limited who can see it.'
        )}

      </div>`;
  }

  state.openC.add(p.id);

  return `

    <div class="page-title">

      <a
        class="icon-btn"
        href="#/home"
        aria-label="Back">

        ${ic('back')}

      </a>

      Post

    </div>

    ${postHTML(p)}

  `;
}


function tagView(tag){

  const u = me();

  const re =
    new RegExp(
      '#' +
      tag.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      ) +
      '(?![\\p{L}\\p{N}_])',
      'iu'
    );

  const posts =
    db.posts.filter(
      p =>
        canSeePost(p,u.id) &&
        re.test(p.text)
    );

  return `

    <div class="page-title">
      #${esc(tag)}
    </div>

    ${feedList(
      posts,
      empty(
        'No posts with this tag',
        'Be the first to use it.'
      )
    )}

  `;
}


function savedView(){

  const u = me();

  const posts =
    savedList()
      .map(
        id =>
          db.posts.find(
            p => p.id === id
          )
      )
      .filter(
        p =>
          p &&
          canSeePost(p,u.id)
      );

  return `

    <div class="page-title">
      Saved posts
    </div>

    ${feedList(
      posts,
      empty(
        'Nothing saved yet',
        'Tap the bookmark on any post to keep it here.'
      )
    )}

  `;
}


function searchView(q){

  const u = me();

  const s =
    q
      .trim()
      .toLowerCase()
      .replace(/^@/,'');

  if(!s){

    return `

      <div class="page-title">
        Search
      </div>

      <div class="card">

        ${empty(
          'Search Vibely',
          'Find people by name or username, or posts by keyword.'
        )}

      </div>`;
  }

  const people =
    db.users.filter(
      x =>
        x.id !== u.id &&
        (
          x.name.toLowerCase().includes(s) ||
          x.handle.includes(s)
        )
    );

  const posts =
    db.posts.filter(
      p =>
        canSeePost(p,u.id) &&
        p.text.toLowerCase().includes(s)
    );

  return `

    <div class="page-title">
      Results for “${esc(q)}”
    </div>

    <section
      class="card pad"
      style="margin-bottom:14px">

      <h3>
        People
      </h3>

      ${
        people.length
          ? people.map(userRow).join('')
          : '<div class="muted">No one matches.</div>'
      }

    </section>

    <h3 style="margin:8px 0 10px">
      Posts
    </h3>

    ${feedList(
      posts,
      empty(
        'No matching posts',
        'Try a different word.'
      )
    )}

  `;
}


function relButtons(x){

  const u = me();

  if(x.id === u.id){

    return `
      <a
        class="btn ghost sm"
        href="#/settings">

        Edit profile

      </a>`;
  }

  if(areFriends(u.id,x.id)){

    return `

      <button
        class="btn ghost sm"
        data-act="msg"
        data-h="${esc(x.handle)}">

        Message

      </button>

      <button
        class="btn ghost sm"
        data-act="unfriend"
        data-id="${x.id}">

        Unfriend

      </button>`;
  }

  const r =
    reqBetween(u.id,x.id);

  if(r){

    return r.to === u.id

      ? `

        <button
          class="btn primary sm"
          data-act="accept"
          data-id="${x.id}">

          Accept

        </button>

        <button
          class="btn ghost sm"
          data-act="decline"
          data-id="${x.id}">

          Decline

        </button>`

      : `

        <button
          class="btn ghost sm"
          data-act="cancelReq"
          data-id="${x.id}">

          Cancel request

        </button>`;
  }

  return `

    <button
      class="btn primary sm"
      data-act="addFriend"
      data-id="${x.id}">

      Add friend

    </button>`;
}


function userRow(x,sub){

  return `

  <div class="urow">

    ${avatar(x,44)}

    <div class="info">

      <a href="#/u/${esc(x.handle)}">
        ${esc(x.name)}
      </a>

      <span>
        ${
          sub ||
          '@' + esc(x.handle)
        }
      </span>

    </div>

    <div class="btns">

      ${relButtons(x)}

    </div>

  </div>`;
}


function peopleList(){

  const u = me();

  const q =
    state.pq
      .trim()
      .toLowerCase()
      .replace(/^@/,'');

  const all =
    db.users.filter(
      x =>
        x.id !== u.id &&
        !areFriends(u.id,x.id) &&
        (
          !q ||
          x.name.toLowerCase().includes(q) ||
          x.handle.includes(q)
        )
    );

  return all.length

    ? all.map(
        x =>
          userRow(
            x,
            mutuals(u.id,x.id)
              ? mutuals(u.id,x.id) +
                ' mutual · @' +
                esc(x.handle)
              : ''
          )
      ).join('')

    : '<div class="muted">No one found.</div>';
}


function friendsView(){

  const u = me();

  const inc = incoming();

  const out =
    db.requests.filter(
      r => r.from === u.id
    );

  const fr =
    friendIds(u.id).map(user);

  return `

    <div class="page-title">
      Friends
    </div>

    <section
      class="card pad"
      style="margin-bottom:14px">

      <h3>
        Find people
      </h3>

      <div
        class="field"
        style="margin-bottom:8px">

        <input
          type="search"
          id="pq"
          placeholder="Search by name or username"
          value="${esc(state.pq)}"
          aria-label="Find people">

      </div>

      <div id="peopleList">
        ${peopleList()}
      </div>

    </section>

    <section
      class="card pad"
      style="margin-bottom:14px">

      <h3>
        Requests (${inc.length})
      </h3>

      ${
        inc.length

          ? inc.map(
              r =>
                userRow(
                  user(r.from),
                  'wants to be friends'
                )
            ).join('')

          : '<div class="muted">No pending requests.</div>'
      }

    </section>

    ${
      out.length

        ? `

          <section
            class="card pad"
            style="margin-bottom:14px">

            <h3>
              Sent requests
            </h3>

            ${
              out.map(
                r =>
                  userRow(
                    user(r.to),
                    'waiting for a reply'
                  )
              ).join('')
            }

          </section>`

        : ''
    }

    <section class="card pad">

      <h3>
        Your friends (${fr.length})
      </h3>

      ${
        fr.length

          ? fr.map(x => userRow(x)).join('')

          : `
            <div class="muted">
              No friends yet.
              Search above to send a request.
            </div>`
      }

    </section>

  `;
}


function profileView(handle){

  const u = me();

  const x = byHandle(handle);

  if(!x){

    return `

      <div class="card">

        ${empty(
          'Profile not found',
          'Check the username and try again.'
        )}

      </div>`;
  }

  const posts =
    db.posts.filter(
      p =>
        p.uid === x.id &&
        canSeePost(p,u.id)
    );

  const ok =
    canViewProfile(x,u.id);

  return `

    <section
      class="card"
      style="margin-bottom:14px;overflow:hidden">

      <div
        class="pcover"
        style="background:linear-gradient(120deg,${esc(x.cover)},#111B2E)">
      </div>

      <div class="phead">

        <div class="top">

          ${avatar(x,96)}

          <div class="row gap">
            ${relButtons(x)}
          </div>

        </div>

        <h2>
          ${esc(x.name)}
        </h2>

        <div class="sub">

          <span>
            @${esc(x.handle)}
          </span>

          <span>·</span>

          <span>
            Joined
            ${
              new Date(
                x.createdAt
              ).toLocaleDateString(
                undefined,
                {
                  month:'long',
                  year:'numeric'
                }
              )
            }
          </span>

          <span>·</span>

          ${privIcon(x.profilePrivacy)}

        </div>

        ${
          ok

            ? `

              <p class="bio">
                ${rich(x.bio || 'No bio yet.')}
              </p>

              <div class="stats">

                <span>
                  <b>
                    ${friendIds(x.id).length}
                  </b>
                  friends
                </span>

                <span>
                  <b>
                    ${
                      db.posts.filter(
                        p =>
                          p.uid === x.id &&
                          canSeePost(p,u.id)
                      ).length
                    }
                  </b>
                  posts
                </span>

              </div>`

            : ''
        }

      </div>

    </section>

    ${
      ok

        ? feedList(
            posts,
            empty(
              x.id === u.id
                ? 'You haven’t posted yet'
                : 'No posts to show',
              x.id === u.id
                ? 'Share something from the Home page.'
                : 'Posts you’re allowed to see appear here.'
            )
          )

        : `

          <div class="card locked">

            <b>
              This profile is private
            </b>

            <br>

            ${
              x.profilePrivacy === 'friends'
                ? 'Only friends can view it. Send a friend request to connect.'
                : 'Only its owner can view it.'
            }

          </div>`
    }

  `;
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function notificationsView(){

  const u = me();

  const list =
    db.notifs
      .filter(n => n.to === u.id)
      .sort(
        (a,b) => b.ts - a.ts
      );

  const text = {

    like:'liked your post',

    comment:'commented on your post',

    request:'sent you a friend request',

    accepted:'accepted your friend request'

  };

  return `

    <div class="page-title">

      Notifications

      <button
        class="btn ghost sm"
        data-act="readAll">

        Mark all read

      </button>

    </div>

    <section
      class="card"
      style="overflow:hidden">

      ${
        list.length

          ? list.map(
              n => {

                const a = user(n.from);

                return `

                <div
                  class="notif ${n.read ? '' : 'unread'}"
                  data-act="openNotif"
                  data-id="${n.id}"
                  role="link"
                  tabindex="0">

                  ${avatar(a,40)}

                  <div class="txt">

                    <b>
                      ${esc(a.name)}
                    </b>

                    ${
                      text[n.type] ||
                      'did something'
                    }

                    <div class="sub">
                      ${ago(n.ts)}
                    </div>

                  </div>

                  ${
                    n.read
                      ? ''
                      : '<span class="dot" aria-label="Unread"></span>'
                  }

                </div>`;
              }
            ).join('')

          : empty(
              'Nothing yet',
              'Likes, comments, and friend requests will show up here.'
            )
      }

    </section>

  `;
}


/* =========================================================
   MESSAGES
   ========================================================= */

function messagesView(cur){

  const u = me();

  const last = f =>
    db.messages
      .filter(
        m =>
          (
            m.from === u.id &&
            m.to === f.id
          ) ||
          (
            m.from === f.id &&
            m.to === u.id
          )
      )
      .sort(
        (a,b) => b.ts - a.ts
      )[0];

  const convs =
    friendIds(u.id)
      .map(user)
      .map(f => ({
        f,
        l:last(f)
      }))
      .sort(
        (a,b) =>
          (b.l ? b.l.ts : 0) -
          (a.l ? a.l.ts : 0)
      );

  const list =
    convs.length

      ? convs.map(({f,l}) => {

          const un =
            db.messages.filter(
              m =>
                m.from === f.id &&
                m.to === u.id &&
                !m.read
            ).length;

          return `

            <a
              class="conv ${cur && cur.id === f.id ? 'on' : ''}"
              href="#/messages/${esc(f.handle)}">

              ${avatar(f,44)}

              <div class="i">

                <b>
                  ${esc(f.name)}
                </b>

                <span>

                  ${
                    l

                      ? (
                          l.from === u.id
                            ? 'You: '
                            : ''
                        ) +
                        esc(l.text)

                      : 'Say hello'
                  }

                </span>

              </div>

              ${
                un
                  ? `<i class="badge">${un}</i>`
                  : ''
              }

            </a>`;
        }).join('')

      : `

        <div class="empty">

          <b>
            No conversations
          </b>

          Add friends to start chatting.

        </div>`;

  let thread = `

    <div class="nochat">

      <div>

        <b
          style="display:block;font-size:17px;color:var(--ink)">

          Your messages

        </b>

        Pick a friend to start a conversation.

      </div>

    </div>`;

  if(cur){

    const ms =
      db.messages
        .filter(
          m =>
            (
              m.from === u.id &&
              m.to === cur.id
            ) ||
            (
              m.from === cur.id &&
              m.to === u.id
            )
        )
        .sort(
          (a,b) => a.ts - b.ts
        );

    thread = `

      <div class="thead">

        <a
          class="icon-btn back"
          href="#/messages"
          aria-label="Back to conversations">

          ${ic('back')}

        </a>

        ${avatar(cur,40)}

        <div>

          <a href="#/u/${esc(cur.handle)}">

            <b>
              ${esc(cur.name)}
            </b>

          </a>

          <div class="sub">
            @${esc(cur.handle)}
          </div>

        </div>

      </div>

      <div
        class="msgs"
        id="msgs">

        ${
          ms.length

            ? ms.map(
                m => `

                  <div
                    class="bubble ${
                      m.from === u.id
                        ? 'mine'
                        : 'theirs'
                    }">

                    ${esc(m.text)}

                  </div>

                  <div
                    class="bt ${
                      m.from === u.id
                        ? 'mine'
                        : ''
                    }">

                    ${ago(m.ts)}

                  </div>`
              ).join('')

            : `
              <div class="nochat">
                No messages yet. Say hello.
              </div>`
        }

      </div>

      <form
        class="mform"
        data-form="message"
        data-to="${cur.id}">

        <input
          type="text"
          name="text"
          id="mInput"
          placeholder="Write a message…"
          maxlength="1000"
          autocomplete="off"
          aria-label="Message"
          required>

        <button class="btn primary">

          ${ic('send')}
          Send

        </button>

      </form>`;
  }

  return `

    <div class="page-title">
      Messages
    </div>

    <section
      class="card chat ${cur ? 'has-thread' : ''}">

      <div class="convs">
        ${list}
      </div>

      <div class="thread">
        ${thread}
      </div>

    </section>`;
}


/* =========================================================
   SETTINGS
   ========================================================= */

function settingsView(){

  const u = me();

  return `

    <div class="page-title">
      Settings
    </div>

    <section
      class="card pad"
      style="margin-bottom:14px">

      <h3>
        Profile
      </h3>

      <form data-form="settings">

        <div
          class="row gap"
          style="margin-bottom:16px">

          ${avatar(u,72)}

          <div class="row gap">

            <label
              class="btn ghost sm"
              style="cursor:pointer">

              Change photo

              <input
                type="file"
                id="sFile"
                accept="image/*"
                hidden>

            </label>

            ${
              u.avatar

                ? `

                  <button
                    type="button"
                    class="btn ghost sm"
                    data-act="rmAvatar">

                    Remove

                  </button>`

                : ''
            }

          </div>

        </div>

        <div class="field">

          <label for="st_name">
            Name
          </label>

          <input
            id="st_name"
            name="name"
            type="text"
            value="${esc(u.name)}"
            maxlength="40"
            required>

        </div>

        <div class="field">

          <label for="st_bio">
            Bio
          </label>

          <textarea
            id="st_bio"
            name="bio"
            maxlength="200"
            rows="3">${esc(u.bio)}</textarea>

        </div>

        <div class="field">

          <label>
            Avatar and cover color
          </label>

          <div class="swatches">

            ${
              PALETTE.map(
                c => `

                  <button
                    type="button"
                    class="sw ${
                      u.color === c
                        ? 'on'
                        : ''
                    }"
                    style="background:${c}"
                    data-act="color"
                    data-c="${c}"
                    aria-label="Color ${c}">
                  </button>`
              ).join('')
            }

          </div>

        </div>

        <div class="field">

          <label for="st_pp">
            Who can view my profile
          </label>

          <select
            id="st_pp"
            name="profilePrivacy"
            style="width:100%">

            <option
              value="public"
              ${
                u.profilePrivacy === 'public'
                  ? 'selected'
                  : ''
              }>
              Public: anyone
            </option>

            <option
              value="friends"
              ${
                u.profilePrivacy === 'friends'
                  ? 'selected'
                  : ''
              }>
              Friends only
            </option>

            <option
              value="me"
              ${
                u.profilePrivacy === 'me'
                  ? 'selected'
                  : ''
              }>
              Only me
            </option>

          </select>

        </div>

        <div class="field">

          <label for="st_dp">
            Default audience for new posts
          </label>

          <select
            id="st_dp"
            name="postPrivacy"
            style="width:100%">

            <option
              value="public"
              ${
                u.postPrivacy === 'public'
                  ? 'selected'
                  : ''
              }>
              Public
            </option>

            <option
              value="friends"
              ${
                u.postPrivacy === 'friends'
                  ? 'selected'
                  : ''
              }>
              Friends only
            </option>

            <option
              value="me"
              ${
                u.postPrivacy === 'me'
                  ? 'selected'
                  : ''
              }>
              Only me
            </option>

          </select>

          <small>
            You can still change the audience on each post.
          </small>

        </div>

        <button class="btn primary">
          Save changes
        </button>

      </form>

    </section>

    <section
      class="card pad"
      style="margin-bottom:14px">

      <h3>
        Change password
      </h3>

      <div
        class="err"
        id="pwErr">
      </div>

      <form data-form="password">

        <div class="field">

          <label for="pw_o">
            Current password
          </label>

          <input
            id="pw_o"
            name="old"
            type="password"
            autocomplete="current-password"
            required>

        </div>

        <div class="field">

          <label for="pw_n">
            New password
          </label>

          <input
            id="pw_n"
            name="new"
            type="password"
            minlength="6"
            autocomplete="new-password"
            required>

        </div>

        <button class="btn ghost">
          Update password
        </button>

      </form>

    </section>

    <section class="card pad">

      <h3>
        Delete account
      </h3>

      <p
        class="muted"
        style="margin-bottom:12px">

        This permanently removes your profile,
        posts, comments, and messages.

      </p>

      <button
        class="btn danger"
        data-act="deleteAccount">

        Delete my account

      </button>

    </section>

  `;
}


/* =========================================================
   ACTIONS
   ========================================================= */

function commit(fn,opts = {}){

  fn();

  if(persist()){

    if(opts.post){

      refreshPost(
        opts.post,
        opts.focus
      );

    }else if(!opts.quiet){

      render();
    }

  }else{

    reload();
  }
}


const A = {

  authTab(t){

    state.authTab =
      t.dataset.t;

    renderAuth();
  },


  async demoLogin(){

    login('u_demo');
  },


  theme(){

    const n =
      document.documentElement.dataset.theme === 'dark'
        ? 'light'
        : 'dark';

    document.documentElement.dataset.theme =
      n;

    localStorage.setItem(
      TKEY,
      n
    );

    render();
  },


  logout(){

    session = null;

    localStorage.removeItem(SKEY);

    location.hash = '';

    render();
  },


  feedTab(t){

    state.tab =
      t.dataset.t;

    state.limit = 10;

    render();
  },


  more(){

    state.limit += 10;

    render();
  },


  closeModalBg(t,e){

    if(e.target === t){

      closeModal();
    }
  },


  lightbox(t){

    openModal(
      `<img src="${t.src}" alt="Full size photo">`,
      'img'
    );
  },


  rmImg(){

    state.draft.img = '';

    render();
  },


  post(){

    const d = state.draft;

    const text =
      d.text.trim();

    if(!text && !d.img){

      return toast(
        'Write something or add a photo first.',
        'error'
      );
    }

    commit(() => {

      db.posts.unshift({

        id:uid(),

        uid:session,

        text,

        img:d.img,

        privacy:
          d.privacy ||
          me().postPrivacy,

        ts:now(),

        likes:[],

        comments:[]

      });

      state.draft = {
        text:'',
        img:'',
        privacy:null
      };

    });

    toast('Posted');
  },


  like(t){

    const p =
      db.posts.find(
        x => x.id === t.dataset.id
      );

    if(!p) return;

    commit(
      () => {

        const i =
          p.likes.indexOf(session);

        if(i >= 0){

          p.likes.splice(i,1);

        }else{

          p.likes.push(session);

          notify(
            p.uid,
            'like',
            session,
            {postId:p.id}
          );
        }

      },
      {
        post:p.id
      }
    );
  },


  save(t){

    const id =
      t.dataset.id;

    const l =
      savedList();

    commit(
      () => {

        const i =
          l.indexOf(id);

        if(i >= 0){

          l.splice(i,1);

        }else{

          l.push(id);
        }

      },
      {
        post:id
      }
    );

    toast(
      l.includes(id)
        ? 'Saved'
        : 'Removed from saved'
    );
  },


  toggleC(t){

    const id =
      t.dataset.id;

    state.openC.has(id)
      ? state.openC.delete(id)
      : state.openC.add(id);

    refreshPost(
      id,
      true
    );
  },


  addComment(t){

    const id =
      t.dataset.id;

    const inp =
      document.querySelector(
        `[data-cin="${id}"]`
      );

    const text =
      inp
        ? inp.value.trim()
        : '';

    const p =
      db.posts.find(
        x => x.id === id
      );

    if(!p || !text) return;

    commit(
      () => {

        p.comments.push({

          id:uid(),

          uid:session,

          text,

          ts:now()

        });

        notify(
          p.uid,
          'comment',
          session,
          {postId:id}
        );

      },
      {
        post:id,
        focus:true
      }
    );
  },


  delComment(t){

    const p =
      db.posts.find(
        x => x.id === t.dataset.id
      );

    if(!p) return;

    commit(
      () => {

        p.comments =
          p.comments.filter(
            c =>
              c.id !== t.dataset.c
          );

      },
      {
        post:p.id
      }
    );
  },


  share(t){

    const url =
      location.href.split('#')[0] +
      '#/post/' +
      t.dataset.id;

    (
      navigator.clipboard
        ? navigator.clipboard.writeText(url)
        : Promise.reject()
    )
    .then(
      () => toast('Link copied'),
      () => toast(url)
    );
  },


  editPost(t){

    const p =
      db.posts.find(
        x => x.id === t.dataset.id
      );

    if(!p) return;

    openModal(`

      <h3>
        Edit post
      </h3>

      <form
        data-form="editPost"
        data-id="${p.id}">

        <div class="field">

          <textarea
            name="text"
            rows="5"
            maxlength="1000"
            aria-label="Post text">${esc(p.text)}</textarea>

        </div>

        <div class="row between">

          ${privSelect(
            'ePriv',
            p.privacy
          )}

          <div class="row gap">

            <button
              type="button"
              class="btn ghost"
              data-act="closeModal">

              Cancel

            </button>

            <button class="btn primary">
              Save
            </button>

          </div>

        </div>

      </form>
    `);
  },


  closeModal(){

    closeModal();
  },


  delPost(t){

    if(
      !confirm(
        'Delete this post? This can’t be undone.'
      )
    ) return;

    commit(() => {

      db.posts =
        db.posts.filter(
          p => p.id !== t.dataset.id
        );

      db.notifs =
        db.notifs.filter(
          n => n.postId !== t.dataset.id
        );

    });

    toast('Post deleted');
  },


  addFriend(t){

    const id =
      t.dataset.id;

    commit(() => {

      if(
        !reqBetween(session,id) &&
        !areFriends(session,id)
      ){

        db.requests.push({

          id:uid(),

          from:session,

          to:id,

          ts:now()

        });

        notify(
          id,
          'request',
          session
        );
      }

    });

    toast('Friend request sent');
  },


  cancelReq(t){

    commit(() => {

      db.requests =
        db.requests.filter(
          r =>
            !(
              r.from === session &&
              r.to === t.dataset.id
            )
        );

    });
  },


  accept(t){

    const id =
      t.dataset.id;

    commit(() => {

      db.requests =
        db.requests.filter(
          r =>
            !(
              r.from === id &&
              r.to === session
            )
        );

      if(
        !areFriends(session,id)
      ){

        db.friends.push({
          a:session,
          b:id
        });
      }

      notify(
        id,
        'accepted',
        session
      );

    });

    toast('You’re now friends');
  },


  decline(t){

    commit(() => {

      db.requests =
        db.requests.filter(
          r =>
            !(
              r.from === t.dataset.id &&
              r.to === session
            )
        );

    });
  },


  unfriend(t){

    if(
      !confirm(
        'Remove this friend?'
      )
    ) return;

    commit(() => {

      db.friends =
        db.friends.filter(
          f =>
            !(
              (
                f.a === session &&
                f.b === t.dataset.id
              ) ||
              (
                f.b === session &&
                f.a === t.dataset.id
              )
            )
        );

    });
  },


  msg(t){

    location.hash =
      '#/messages/' +
      t.dataset.h;
  },


  readAll(){

    commit(() => {

      db.notifs.forEach(
        n => {

          if(n.to === session){

            n.read = true;
          }

        }
      );

    });
  },


  openNotif(t){

    const n =
      db.notifs.find(
        x => x.id === t.dataset.id
      );

    if(!n) return;

    n.read = true;

    persist();

    location.hash =
      n.postId

        ? '#/post/' + n.postId

        : n.type === 'request'

          ? '#/friends'

          : '#/u/' +
            user(n.from).handle;

    render();
  },


  color(t){

    applySettingsFields();

    commit(() => {

      const u = me();

      u.color =
        t.dataset.c;

      u.cover =
        PALETTE[
          (
            PALETTE.indexOf(
              t.dataset.c
            ) + 3
          ) % 8
        ];

    });
  },


  rmAvatar(){

    applySettingsFields();

    commit(() => {

      me().avatar = '';

    });
  },


  deleteAccount(){

    if(
      !confirm(
        'Delete your account permanently? All your posts and messages will be removed.'
      )
    ) return;

    const id =
      session;

    db.users =
      db.users.filter(
        x => x.id !== id
      );

    db.posts =
      db.posts.filter(
        p => p.uid !== id
      );

    db.posts.forEach(
      p => {

        p.likes =
          p.likes.filter(
            x => x !== id
          );

        p.comments =
          p.comments.filter(
            c => c.uid !== id
          );

      }
    );

    db.friends =
      db.friends.filter(
        f =>
          f.a !== id &&
          f.b !== id
      );

    db.requests =
      db.requests.filter(
        r =>
          r.from !== id &&
          r.to !== id
      );

    db.notifs =
      db.notifs.filter(
        n =>
          n.to !== id &&
          n.from !== id
      );

    db.messages =
      db.messages.filter(
        m =>
          m.from !== id &&
          m.to !== id
      );

    delete db.saved[id];

    persist();

    A.logout();
  }
};


/* =========================================================
   SETTINGS
   ========================================================= */

function applySettingsFields(){

  const f =
    document.querySelector(
      '[data-form="settings"]'
    );

  if(!f) return;

  const u = me();

  const n =
    f.name.value.trim();

  if(n){
    u.name = n;
  }

  u.bio =
    f.bio.value.trim();

  u.profilePrivacy =
    f.profilePrivacy.value;

  u.postPrivacy =
    f.postPrivacy.value;
}


/* =========================================================
   LOGIN
   ========================================================= */

async function login(id){

  session = id;

  localStorage.setItem(
    SKEY,
    id
  );

  location.hash =
    '#/home';

  render();
}


/* =========================================================
   EVENTS
   ========================================================= */

document.addEventListener(
  'click',
  e => {

    const t =
      e.target.closest(
        '[data-act]'
      );

    if(
      t &&
      A[t.dataset.act]
    ){

      e.preventDefault();

      A[t.dataset.act](
        t,
        e
      );
    }
  }
);


document.addEventListener(
  'keydown',
  e => {

    const t =
      e.target;

    if(e.key === 'Escape'){

      closeModal();
    }

    if(
      e.key === 'Enter' &&
      t.matches &&
      t.matches('[data-cin]')
    ){

      e.preventDefault();

      A.addComment({
        dataset:{
          id:t.dataset.cin
        }
      });
    }

    if(
      e.key === 'Enter' &&
      t.matches &&
      t.matches('.notif')
    ){

      A.openNotif(t);
    }
  }
);


document.addEventListener(
  'input',
  e => {

    const t =
      e.target;

    if(t.id === 'cText'){

      state.draft.text =
        t.value;

      const count =
        $('#cCount');

      if(count){

        count.textContent =
          t.value.length +
          '/1000';
      }

      t.style.height =
        'auto';

      t.style.height =
        Math.min(
          t.scrollHeight,
          260
        ) + 'px';
    }

    if(t.id === 'pq'){

      state.pq =
        t.value;

      $('#peopleList').innerHTML =
        peopleList();
    }
  }
);


document.addEventListener(
  'change',
  async e => {

    const t =
      e.target;

    try{

      if(t.id === 'cPriv'){

        state.draft.privacy =
          t.value;
      }

      if(
        t.id === 'cFile' &&
        t.files[0]
      ){

        state.draft.img =
          await fileToDataURL(
            t.files[0],
            1000
          );

        render();
      }

      if(
        t.id === 'sFile' &&
        t.files[0]
      ){

        const url =
          await fileToDataURL(
            t.files[0],
            320
          );

        applySettingsFields();

        commit(() => {

          me().avatar =
            url;

        });
      }

    }catch(err){

      toast(
        err.message ||
        'Something went wrong.',
        'error'
      );
    }
  }
);


/* =========================================================
   FORMS
   ========================================================= */

document.addEventListener(
  'submit',
  async e => {

    const f =
      e.target;

    const kind =
      f.dataset.form;

    if(!kind) return;

    e.preventDefault();


    /* LOGIN */

    if(kind === 'login'){

      const id =
        f.id.value
          .trim()
          .toLowerCase()
          .replace(/^@/,'');

      const h =
        await hash(
          f.pw.value
        );

      const u =
        db.users.find(
          x =>
            x.email === id ||
            x.handle === id
        );

      if(
        !u ||
        u.pass !== h
      ){

        return authErr(
          'Email, username, or password is incorrect.'
        );
      }

      login(u.id);
    }


    /* SIGNUP */

    if(kind === 'signup'){

      const name =
        f.name.value.trim();

      const handle =
        f.handle.value
          .trim()
          .toLowerCase();

      const email =
        f.email.value
          .trim()
          .toLowerCase();

      const pw =
        f.pw.value;

      if(
        !/^[a-z0-9_]{3,20}$/.test(handle)
      ){

        return authErr(
          'Username must be 3–20 letters, numbers, or underscores.'
        );
      }

      if(pw.length < 6){

        return authErr(
          'Password must be at least 6 characters.'
        );
      }

      if(
        db.users.some(
          x => x.handle === handle
        )
      ){

        return authErr(
          'That username is taken.'
        );
      }

      if(
        db.users.some(
          x => x.email === email
        )
      ){

        return authErr(
          'An account with that email already exists.'
        );
      }

      const ci =
        Math.floor(
          Math.random() *
          PALETTE.length
        );

      const u = {

        id:uid(),

        name,

        handle,

        email,

        pass:
          await hash(pw),

        bio:'',

        avatar:'',

        color:PALETTE[ci],

        cover:
          PALETTE[
            (ci + 3) % 8
          ],

        profilePrivacy:'public',

        postPrivacy:'public',

        createdAt:now(),

        bot:false
      };

      db.users.push(u);

      if(!persist()){

        db.users.pop();

        return;
      }

      login(u.id);
    }


    /* SEARCH */

    if(kind === 'search'){

      const q =
        f.q.value.trim();

      location.hash =
        q
          ? '#/search/' +
            encodeURIComponent(q)
          : '#/search';
    }


    /* EDIT POST */

    if(kind === 'editPost'){

      const p =
        db.posts.find(
          x =>
            x.id ===
            f.dataset.id
        );

      const text =
        f.text.value.trim();

      if(!p) return;

      if(!text && !p.img){

        return toast(
          'A post needs some text or a photo.',
          'error'
        );
      }

      commit(() => {

        p.text = text;

        p.privacy =
          $('#ePriv').value;

        p.edited = true;

      });

      closeModal();

      toast('Post updated');
    }


    /* MESSAGE */

    if(kind === 'message'){

      const text =
        f.text.value.trim();

      const to =
        f.dataset.to;

      if(!text) return;

      commit(() => {

        db.messages.push({

          id:uid(),

          from:session,

          to,

          text,

          ts:now(),

          read:false

        });

      });

      const inp =
        $('#mInput');

      if(inp){
        inp.focus();
      }

      const peer =
        user(to);

      if(peer.bot){

        setTimeout(() => {

          if(
            !db ||
            !db.users.some(
              x => x.id === peer.id
            )
          ) return;

          db.messages.push({

            id:uid(),

            from:peer.id,

            to:session,

            text:
              CANNED[
                Math.floor(
                  Math.random() *
                  CANNED.length
                )
              ],

            ts:now(),

            read:false

          });

          const viewing =
            location.hash ===
            '#/messages/' +
            peer.handle;

          if(viewing){

            db.messages[
              db.messages.length - 1
            ].read = true;
          }

          persist();

          if(viewing){

            const typing =
              document.activeElement &&
              document.activeElement.id ===
              'mInput';

            const v =
              $('#mInput')
                ? $('#mInput').value
                : '';

            render();

            const i =
              $('#mInput');

            if(i && typing){

              i.value = v;

              i.focus();
            }

          }else{

            toast(
              peer.name +
              ' sent you a message'
            );

            render();
          }

        },1400 + Math.random() * 1600);
      }
    }


    /* SETTINGS */

    if(kind === 'settings'){

      const n =
        f.name.value.trim();

      if(!n){

        return toast(
          'Name can’t be empty.',
          'error'
        );
      }

      commit(() => {

        applySettingsFields();

      });

      toast('Changes saved');
    }


    /* PASSWORD */

    if(kind === 'password'){

      const u =
        me();

      const err =
        $('#pwErr');

      if(
        u.pass !==
        await hash(f.old.value)
      ){

        err.textContent =
          'Current password is incorrect.';

        return;
      }

      if(
        f.new.value.length < 6
      ){

        err.textContent =
          'New password must be at least 6 characters.';

        return;
      }

      u.pass =
        await hash(
          f.new.value
        );

      persist();

      err.textContent = '';

      f.reset();

      toast('Password updated');
    }

  }
);


/* =========================================================
   LIVE SYNC BETWEEN TABS
   ========================================================= */

window.addEventListener(
  'storage',
  e => {

    if(e.key === KEY){

      reload();

      const a =
        document.activeElement;

      if(
        a &&
        /^(INPUT|TEXTAREA|SELECT)$/.test(
          a.tagName
        )
      ){

        return;
      }

      render();
    }

    if(e.key === SKEY){

      session =
        localStorage.getItem(
          SKEY
        );

      render();
    }
  }
);


/* =========================================================
   BOOT
   ========================================================= */

(async function init(){

  const th =
    localStorage.getItem(TKEY) ||
    (
      matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches
        ? 'dark'
        : 'light'
    );

  document.documentElement.dataset.theme =
    th;

  try{

    const r =
      localStorage.getItem(KEY);

    if(r){

      db =
        JSON.parse(r);
    }

  }catch(e){}

  if(!db){

    db =
      await seed();

    persist();
  }

  render();

  setInterval(
    () => {

      const a =
        document.activeElement;

      if(
        session &&
        !(
          a &&
          /^(INPUT|TEXTAREA|SELECT)$/.test(
            a.tagName
          )
        ) &&
        !$('#modal-root').innerHTML
      ){

        render();
      }

    },
    60000
  );

})();

})();