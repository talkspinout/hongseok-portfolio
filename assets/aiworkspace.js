(function(){
  const imageSources={
    handoff:'assets/aiworkspace-handoff.webp',
    overview:'assets/aiworkspace-overview.webp',
    newtask:'assets/aiworkspace-newtask.webp'
  };

  function renderImages(){
    document.querySelectorAll('img[data-img]').forEach(el=>{
      const src=imageSources[el.dataset.img];
      if(src) el.src=src;
    });

    const taskFig=document.querySelector('.task-hires');
    if(taskFig){
      taskFig.classList.add('task-focus-crop');
      taskFig.innerHTML=`<img class="zoomable-shot" alt="TASK-0023 Task Detail 실제 화면" src="assets/aiworkspace-task-0023.webp"><figcaption class="figcap">실제 Task Detail · Current checkpoint와 Latest handoff</figcaption>`;
    }

    document.querySelectorAll('.proof-shot img').forEach(img=>img.classList.add('zoomable-shot'));
  }

  function renderHero(){
    const concept=document.querySelector('.hero-concept');
    if(!concept) return;
    concept.setAttribute('aria-label','Task 중심 워크플로우 개념 그래픽');
    concept.innerHTML=`
      <div class="concept-head">
        <div class="concept-label">TASK-CENTERED WORKFLOW</div>
        <div class="concept-badges" aria-label="워크플로우 핵심 상태">
          <span class="concept-badge">Checkpoint</span>
          <span class="concept-badge">Handoff</span>
          <span class="concept-badge">Next Agent</span>
        </div>
      </div>
      <div class="concept-track richer">
        <div class="concept-line"></div>
        <div class="concept-node discord"><div class="concept-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8.5c0-1.4 1.1-2.5 2.5-2.5h7C16.9 6 18 7.1 18 8.5v5c0 1.4-1.1 2.5-2.5 2.5H11l-3.5 2v-2H8.5C7.1 16 6 14.9 6 13.5v-5Z"/></svg></div><span>Input</span><strong>Discord</strong></div>
        <span class="concept-arrow">→</span>
        <div class="concept-node task"><div class="concept-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7h8M8 12h8M8 17h5"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg></div><span>Core</span><strong>Task</strong></div>
        <span class="concept-arrow">→</span>
        <div class="concept-node active"><div class="concept-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><circle cx="12" cy="12" r="4"/></svg></div><span>Agent A</span><strong>Work</strong></div>
        <span class="concept-arrow">→</span>
        <div class="concept-node handoff"><div class="concept-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h8"/><path d="m11 8 4 4-4 4"/><path d="M18 7v10"/></svg></div><span>Context</span><strong>Handoff</strong></div>
        <span class="concept-arrow">→</span>
        <div class="concept-node next"><div class="concept-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12a5 5 0 0 0 8.5 3.5L18 13"/><path d="M17 11a5 5 0 0 0-8.5-3.5L6 10"/></svg></div><span>Agent B</span><strong>Continue</strong></div>
      </div>
      <div class="concept-meta">
        <div class="concept-chip"><span class="chip-dot"></span>Goal · Decisions · Next action이 Task에 남습니다.</div>
        <div class="concept-chip"><span class="chip-dot"></span>AI가 바뀌어도 같은 Task를 읽고 이어받습니다.</div>
      </div>`;
  }

  function renderDemo(){
    const demo=document.querySelector('.demo-video-block');
    const tools=document.querySelector('.tools-row');
    if(!demo || !tools) return;

    const head=demo.querySelector('.demo-video-head');
    if(head) head.innerHTML='<span class="demo-eyebrow">PRODUCT DEMO</span><strong>실제 Task가 Agent를 바꿔가며 이어지는 흐름</strong><p>Discord에서 Task를 만들고, Handoff로 다음 Agent에게 넘기고, Admin에서 같은 상태를 확인하는 실제 시연입니다.</p>';

    const stage=demo.querySelector('.demo-video-stage');
    if(stage) stage.innerHTML='<iframe src="https://www.youtube.com/embed/lg5cbHGhoUI?rel=0&modestbranding=1" title="AI Workspace 실제 시연 영상" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';

    const note=demo.querySelector('.demo-note');
    if(note) note.remove();

    if(!demo.closest('.demo-section')){
      const shell=document.createElement('section');
      shell.className='demo-section';
      const wrap=document.createElement('div');
      wrap.className='wrap';
      shell.appendChild(wrap);
      wrap.appendChild(demo);
      tools.insertAdjacentElement('afterend',shell);
    }
  }

  function renderFuture(){
    const vision=[...document.querySelectorAll('section.section')].at(-1);
    if(!vision) return;
    const list=vision.querySelector('.future-list');
    if(!list) return;
    list.innerHTML=`
      <div class="future-item"><div class="future-no">01</div><div><h3>Handoff를 더 다양한 작업에서 검증하고, 현업 Workflow에도 적용해보기.</h3></div></div>
      <div class="future-item"><div class="future-no">02</div><div><h3>Task Admin을 Workflow의 Hub로 두고, 다양한 MCP 연결을 확장해보기.</h3></div></div>
      <div class="future-item future-commercial"><div class="future-no">03</div><div><h3>가능하다면 사이드잡으로 상업화해보기. <span class="future-detail">Notion 템플릿이나 Discord Bot 같은 형태도 생각하고 있습니다.</span></h3></div></div>`;
  }

  function installImageLightbox(){
    if(document.getElementById('aiworkspace-lightbox')) return;

    const lightbox=document.createElement('div');
    lightbox.id='aiworkspace-lightbox';
    lightbox.className='image-lightbox';
    lightbox.hidden=true;
    lightbox.setAttribute('role','dialog');
    lightbox.setAttribute('aria-modal','true');
    lightbox.setAttribute('aria-label','실제 화면 확대 보기');
    lightbox.innerHTML=`<button class="image-lightbox-close" type="button" aria-label="확대 화면 닫기">×</button><div class="image-lightbox-inner"><img alt=""><div class="image-lightbox-caption"></div></div>`;
    document.body.appendChild(lightbox);

    const full=lightbox.querySelector('img');
    const caption=lightbox.querySelector('.image-lightbox-caption');
    const close=lightbox.querySelector('.image-lightbox-close');
    let previousFocus=null;

    function closeLightbox(){
      if(lightbox.hidden) return;
      lightbox.hidden=true;
      document.body.classList.remove('lightbox-open');
      if(previousFocus && typeof previousFocus.focus==='function') previousFocus.focus();
    }

    function openLightbox(img){
      previousFocus=document.activeElement;
      full.src=img.currentSrc||img.src;
      full.alt=img.alt||'실제 화면 확대 이미지';
      const fig=img.closest('figure');
      const cap=fig&&fig.querySelector('figcaption');
      caption.textContent=cap ? cap.textContent.trim() : (img.alt||'');
      lightbox.hidden=false;
      document.body.classList.add('lightbox-open');
      close.focus();
    }

    document.querySelectorAll('.zoomable-shot').forEach(img=>{
      img.setAttribute('tabindex','0');
      img.setAttribute('role','button');
      img.setAttribute('aria-label',`${img.alt||'실제 화면'} 확대 보기`);
      img.addEventListener('click',()=>openLightbox(img));
      img.addEventListener('keydown',event=>{
        if(event.key==='Enter' || event.key===' '){
          event.preventDefault();
          openLightbox(img);
        }
      });
    });

    close.addEventListener('click',closeLightbox);
    lightbox.addEventListener('click',event=>{if(event.target===lightbox) closeLightbox();});
    document.addEventListener('keydown',event=>{if(event.key==='Escape') closeLightbox();});
  }

  function installStyles(){
    if(document.getElementById('aiworkspace-runtime-fixes')) return;
    const style=document.createElement('style');
    style.id='aiworkspace-runtime-fixes';
    style.textContent=`
      .hero-concept{position:relative!important;min-height:330px!important;padding:24px!important;border-radius:20px!important;background:radial-gradient(circle at 20% 20%,rgba(45,127,132,.08),transparent 28%),linear-gradient(145deg,#fbfcfd 0%,#eef3f4 100%)!important;display:flex!important;flex-direction:column!important;justify-content:space-between!important;box-shadow:0 16px 38px rgba(24,39,56,.05)!important}
      .hero-concept:before{content:"";position:absolute;inset:18px;pointer-events:none;border-radius:16px;border:1px solid rgba(36,101,107,.08)}
      .concept-head{display:flex!important;align-items:flex-start!important;justify-content:space-between!important;gap:12px!important;position:relative!important;z-index:2!important}.concept-label{position:static!important;font-size:11.5px!important}.concept-badges{display:flex!important;align-items:center!important;gap:8px!important;flex-wrap:wrap!important;justify-content:flex-end!important}
      .concept-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;padding:6px 10px!important;border-radius:999px!important;background:#f4fbfb!important;border:1px solid #b9d8d6!important;color:var(--accent-strong)!important;box-shadow:none!important;font-size:11.5px!important;line-height:1!important;font-weight:620!important;cursor:default!important}
      .concept-track.richer{position:relative!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;white-space:nowrap!important;padding:10px 0 8px!important;z-index:1!important}.concept-line{position:absolute;left:50px;right:50px;top:50%;height:2px;background:linear-gradient(90deg,rgba(45,127,132,.08),rgba(45,127,132,.34),rgba(45,127,132,.08));transform:translateY(-50%)}
      .concept-node{position:relative!important;width:104px!important;min-height:120px!important;border-radius:16px!important;padding:14px 12px 12px!important;align-items:flex-start!important;gap:8px!important;z-index:1!important}.concept-node span{font-size:11.5px!important;margin:0!important}.concept-node strong{font-size:16px!important;line-height:1.15!important}
      .concept-icon{width:34px;height:34px;border-radius:12px;background:#f3f8f8;border:1px solid #dbe9e9;display:grid;place-items:center;color:var(--accent-strong)}.concept-icon svg{width:18px;height:18px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.concept-node.task,.concept-node.active{border-color:#9bc6c5!important;box-shadow:0 10px 28px rgba(45,127,132,.12)!important}.concept-arrow{position:relative!important;z-index:1!important;color:#88a6ab!important}
      .concept-meta{display:grid;grid-template-columns:1fr 1fr;gap:12px;position:relative;z-index:1}.concept-chip{padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.9);border:1px solid #e1e8ec;font-size:14px;line-height:1.5;color:var(--text);box-shadow:0 8px 22px rgba(24,39,56,.04)}.chip-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-right:8px;vertical-align:1px;box-shadow:0 0 0 4px rgba(45,127,132,.12)}
      .demo-section{padding:54px 0 72px!important;border-bottom:1px solid var(--line)!important;background:#fff!important}.demo-section .demo-video-block{margin:0!important}.demo-section .demo-video-head{max-width:860px!important;margin-bottom:22px!important}.demo-section .demo-video-stage{position:relative!important;width:100%!important;max-width:1120px!important;aspect-ratio:16/9!important;height:auto!important;border:1px solid var(--line)!important;border-radius:16px!important;overflow:hidden!important;background:#0f141b!important;box-shadow:0 18px 42px rgba(24,39,56,.10)!important}.demo-section .demo-video-stage iframe{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;border:0!important}
      .task-focus-crop{width:100%!important;max-width:none!important;height:auto!important;overflow:hidden!important;background:#fff!important;border-radius:11px!important}.task-focus-crop img{width:100%!important;height:auto!important;max-height:none!important;object-fit:contain!important;object-position:center top!important}.proof-shot img{height:190px!important}.zoomable-shot{cursor:zoom-in!important}.zoomable-shot:focus-visible{outline:3px solid rgba(45,127,132,.36)!important;outline-offset:-3px!important}
      .future-item h3{font-size:21px!important;line-height:1.58!important}.future-commercial h3{white-space:normal!important}.future-commercial .future-detail{font-size:16px!important;font-weight:620!important;color:var(--ink)!important;letter-spacing:-.02em!important;margin-left:6px!important}
      body.lightbox-open{overflow:hidden!important}.image-lightbox[hidden]{display:none!important}.image-lightbox{position:fixed;inset:0;z-index:9999;background:rgba(12,18,28,.86);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:32px}.image-lightbox-inner{max-width:min(1480px,94vw);max-height:90vh;display:flex;flex-direction:column;gap:10px;align-items:center}.image-lightbox img{display:block;max-width:100%;max-height:84vh;width:auto;height:auto;border-radius:10px;background:#fff;box-shadow:0 28px 80px rgba(0,0,0,.32)}.image-lightbox-caption{font-size:13px;line-height:1.5;color:rgba(255,255,255,.78);text-align:center}.image-lightbox-close{position:fixed;top:18px;right:22px;width:42px;height:42px;border:1px solid rgba(255,255,255,.28);border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font:300 28px/1 Arial,sans-serif;cursor:pointer}.image-lightbox-close:hover{background:rgba(255,255,255,.2)}
      @media(max-width:700px){.concept-head{display:block!important}.concept-badges{margin-top:12px!important;justify-content:flex-start!important}.concept-track.richer{overflow-x:auto!important;justify-content:flex-start!important;gap:6px!important}.concept-node{min-width:94px!important;width:94px!important}.concept-meta{grid-template-columns:1fr!important}.concept-chip{font-size:13px!important}.demo-section{padding:42px 0 56px!important}.demo-section .demo-video-stage{border-radius:12px!important}.task-focus-crop img{width:100%!important;height:auto!important}.future-commercial .future-detail{font-size:15.5px!important;margin-left:0!important}.image-lightbox{padding:18px}.image-lightbox img{max-height:82vh}.image-lightbox-close{top:10px;right:10px}}
    `;
    document.head.appendChild(style);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    installStyles();
    renderHero();
    renderDemo();
    renderFuture();
    renderImages();
    installImageLightbox();
  });
})();
