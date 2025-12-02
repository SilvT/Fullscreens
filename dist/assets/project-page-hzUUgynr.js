const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/caseStudy-nmsMm48a.js","assets/iconoir-B_doVMCY.js","assets/iconoir-BysfP_xg.css"])))=>i.map(i=>d[i]);
import{g as p,S as g,u as w,c as C,t as S,p as $}from"./iconoir-B_doVMCY.js";import"./main-Dr4BX-0b.js";const T="modulepreload",L=function(e){return"/"+e},f={},k=function(t,n,r){let s=Promise.resolve();if(n&&n.length>0){let a=function(i){return Promise.all(i.map(d=>Promise.resolve(d).then(u=>({status:"fulfilled",value:u}),u=>({status:"rejected",reason:u}))))};document.getElementsByTagName("link");const c=document.querySelector("meta[property=csp-nonce]"),m=c?.nonce||c?.getAttribute("nonce");s=a(n.map(i=>{if(i=L(i),i in f)return;f[i]=!0;const d=i.endsWith(".css"),u=d?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${u}`))return;const l=document.createElement("link");if(l.rel=d?"stylesheet":T,d||(l.as="script"),l.crossOrigin="",l.href=i,m&&l.setAttribute("nonce",m),document.head.appendChild(l),d)return new Promise((E,P)=>{l.addEventListener("load",E),l.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${i}`)))})}))}function o(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return s.then(a=>{for(const c of a||[])c.status==="rejected"&&o(c.reason);return t().catch(o)})};p.registerPlugin(g);const O=["1","2","3","4"],b={1:"marketing-management",2:"design-system",3:"energy-tracker",4:"figma-plugin"},M=Object.fromEntries(Object.entries(b).map(([e,t])=>[t,e]));function _(){const t=document.documentElement.getAttribute("data-project-id");if(t)return t;const r=window.location.pathname.replace(/^\//,"").replace(/\.html$/,"");return M[r]||null}async function j(e){const t=$[e];if(!t)return console.error(`Project not found: ${e}`),y("Project not found"),null;let n=null;if(t.contentFile)try{const r=await fetch(t.contentFile);r.ok&&(n=await r.json())}catch(r){console.warn("Could not load project detail file:",r)}return!n&&t.contentBlocks&&(n=t),{projectIndex:t,projectDetail:n}}function B(e,t,n){k(()=>import("./caseStudy-nmsMm48a.js"),__vite__mapDeps([0,1,2])).then(r=>{r.renderCaseStudyContent?r.renderCaseStudyContent(e,t,n):v(e,t,n)}).catch(r=>{console.error("Error loading case study module:",r),v(e,t,n)})}function v(e,t,n){const r=t?.jobTitle||e.jobTitle||"Product Designer",s=e.company||"",o=t?.duration||e.duration||e.year||"";n.innerHTML=`
    <div class="cs-header">
      <div class="cs-meta">
        <span class="cs-role">${r}</span>
        ${s?`<span class="cs-company">${s}</span>`:""}
        ${o?`<span class="cs-duration">${o}</span>`:""}
      </div>
      <h1 class="cs-title">${e.title}</h1>
      ${e.subtitle?`<p class="cs-subtitle">${e.subtitle}</p>`:""}
    </div>

    ${e.heroImage?`
      <div class="cs-hero-image">
        <img src="${e.heroImage}" alt="${e.title}" loading="eager" />
      </div>
    `:""}

    <div class="cs-content">
      ${e.cardOverview?`
        <div class="cs-overview">
          <h2>Overview</h2>
          <p>${e.cardOverview}</p>
        </div>
      `:""}

      ${e.cardMetrics&&e.cardMetrics.length>0?`
        <div class="cs-metrics-grid">
          ${e.cardMetrics.map(a=>R(a)).join("")}
        </div>
      `:""}
    </div>
  `}function R(e){const t=e.icon?A(e.icon):"";return`
    <div class="cs-metric-card">
      <div class="cs-metric-content">
        <div class="cs-metric-top">
          ${t?`<div class="cs-metric-icon-wrapper"><span class="cs-metric-icon">${t}</span></div>`:""}
          <div class="cs-metric-value">${e.value}</div>
        </div>
        <div class="cs-metric-label">${e.label}</div>
      </div>
      <div class="cs-metric-border" aria-hidden="true"></div>
    </div>
  `}function A(e){if(!e)return"";if(e.includes(":")){const[t,n]=e.split(":");if(t==="iconoir")return`<i class="iconoir-${n}"></i>`;if(t==="ph"||t==="phosphor")return`<i class="ph-light ph-${n}"></i>`}return`<i class="iconoir-${e}"></i>`}function y(e){const t=document.getElementById("project-content");t&&(t.innerHTML=`
      <div class="cs-error">
        <h2>Error</h2>
        <p>${e}</p>
        <a href="/" class="cs-error-link">Back to Projects</a>
      </div>
    `)}function D(e){const t=document.getElementById("breadcrumb-navigation");t&&(t.innerHTML=O.map(n=>{const r=$[n];if(!r)return"";const s=b[n],o=n===e;return`
      <a href="/${s}"
         class="breadcrumb-link ${o?"active":""}"
         ${o?'aria-current="page"':""}>
        ${r.title}
      </a>
    `}).join('<span class="breadcrumb-separator">→</span>'))}function U(){p.registerPlugin(g)}async function h(){const e=_();if(!e){y("Project ID not found");return}console.log("Loading project:",e);const t=await j(e);if(!t)return;const{projectIndex:n,projectDetail:r}=t,s=document.getElementById("project-content");s&&n.theme&&s.setAttribute("data-theme",n.theme),B(n,r,s),w(n),D(e),setTimeout(()=>{C()},500),S(e,n.title),U(),console.log("Project page initialized")}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",h):h();
