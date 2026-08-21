document.addEventListener('DOMContentLoaded',()=>{
  const data=window.AIWIMG||{};
  document.querySelectorAll('img[data-img]').forEach(el=>{const v=data[el.dataset.img];if(v)el.src='data:image/webp;base64,'+v;});

  const line=document.querySelector('.philosophy-line');
  if(line){line.innerHTML='<strong>그러니까, “효율적으로 작업하고, 올바르게 판단하고, 나와 AI가 틀릴 수 있다는 걸 명심하자.”라고 이야기하겠습니다.</strong>';}

  const iconData={discord:'UklGRowDAABXRUJQVlA4WAoAAAAQAAAALwAALwAAQUxQSLMAAAABcFtbe9N8CiW0sFDaIZRIA8FQbEPlbIvfWT9ydhURity2bayk6x71D/huEUozUGLOCUzYBwGkeW2sh7bKUkAwO+pHYjF2EauEjAcid9h7OTiiIZaMUuhpMxGLaUM9FOMtWbhzM8stEgj/XpAjNo5K/6bRTHt+9lMD7Y+hOSHDiZ0X+3/LI+bo0XOqUM7zQAEV3jPBPRbekzwPd1wP9xEE2/NZ1VoPps5TQAT/R4L/U18tAABWUDggsgIAABARAJ0BKjAAMAA+YSSPRSQiIRjpnvxABgS2AFiSoKpe/HMbvludu828mFH60dAH9u8QG2q+pT9Of2395L8APUl9gD+gfwDgAP4B/rvTM9jv9lfYA/i/9b////ZMMFMS/5X2ge33UG8lUkTgyomkZ4XGk04X1g7mHLuEErUv+dkGYRqQREGn6roDVD5MPldKS4AA/v86QNpSDK/B9jWlaeef8Si0o4yOmqhCS/FuYTj87I7kAdfJ0vCq9j++H88Ba2cmfVKe75YwRuyTZ9aTL4uH/QMU53wwDlXZgR76MWy0kz2sKwPPJ1FTVVYEPS2SSfygjD/7BvHkTNth+Z+TnY6h6AOfj2v+5ld+Ic8jZOx2wQXX1+zTAI3ZIza1Y6B8GgdayYgDXr9U2ILzTv8/q+lj4urU6Thx55/Md7JjJ3SeimyI2k5dvOJlX9ysEIhnwQ7ds0/mA0KfOwL0K6krD09ZrSRrK+4t4F4puwtcaZYg97CDuWu5Stp+eZtKfbCyUlFljt0uO6dJq2A0GHjgXNnKrwqpz4n+q38S7QCFO+cfxjEh00CKf/exyxVMRTi9M0gF+lUwz/I858b0RPKOnZX1CZ6tjuzJ4vZWlLCEDAMkYekQJFHKX260wWtkg+EevcUgZpe76CpZiyfzFeHIKHuaVX3ufeqSx5iluVT3a+L+ewuVRW9xAXD9jpMI6V5DDhhBUpFjPMF4HoUAGHsycC9RZzzl8EZDFR6rQolcAi44bfA74K0QG25/74PfkvaQXrUiE6rdwK/hz5wrwPkao7+8wtwPd3MXOgxZ9XA3x1ol4UT+/SSAVPe4eWK2L9jD7t1XhV/T35DrgAOGcmqUJF8uDwKIzI5+uF8PiUt/+XITsqlKKXOaUv1bF1zNO19B05IiJgr0YzYmdPN6wgPBNdAAAA==',cloudflare:'UklGRvIBAABXRUJQVlA4WAoAAAAQAAAALwAALwAAQUxQSG0AAAABYNvadpMn/RXskQhr2SMSS1dmhAzfhIpHjRQRBAIUYYM2QGBdPWp6HR1rbyEQlCHREkoIck27ctA9aQYzpD3Rsqdo/DNmfa8Hk0P7JZGzpN9LFvr4P0v/cWci2xOQkT3kA8+BwLqK41GVsxAAAFZQOCBeAQAAkAgAnQEqMAAwAD5hLJJGpCKhoSq1WViADAlqAL69736q7QGGA/XTJAOe+/XL4UP2e9IAmeU5GveL9jamCE/jovxon1TPaZwvE1zR2YAA/v4UoBbWA2HD/XpZzyQG2/LcmDDMC+NI8K2hiL00s0/DU/E7OKRXQgAcfZATZ6D21/ydxfB7sskBKU/Rt+S9J3y5bod74YX+Z1oP0s5d26eCClxwedou25gsPgJXafGOEC2cCdt3wbQ3b3oGMv8YsULWak9vPAmUBs/0kFU/Y3TlWi3aG7worzdv6S6LFxOpIrNDs57qD3Nq2HJkVfI2Si6sP/+hXcaySaP10Mw/BENPXdCl4VyZafAab0oKdQy8+ZBn4xU57oa3ek50NRcCEJxTZwWigOCLucvvWd+GYQouv+/fH7965fWtDbQgZpvG/8hBIQth6kYiNk5TLs6vol4nz0BrYAYTtilMhUL4AAA=',codex:'UklGRuIBAABXRUJQVlA4INYBAACQCgCdASowADAAPl0mjkUjoiEY6zb8OAXEtgBghdxPLxdeAnbk9473kHyZiZtXij5qCSd1oj7Y8T5Tvp0g+jZ2kQxCGM5+ZvxngfdVbHZtmkBVKH1f1NYJzA4NCAAA/v/484NrChWwURbh8RTB3xiDZ/YVMs7FmlBa/9rx2wGOF3dnT/FIzPJ7X74Zpbot27BVyeEGXlI/bdyXEp7M+51N06cDYX6O96ONZJd3K/PpKAEJhUD/HBBG+zZpe/oonNPLEeRKpsN7+XgTaM28KtREgWqhL2a8mkarjqCuKGOCD5k3VGsz2tWRZxc5zNT9mM5pKr/v89Bi3ba05VOr3ret+GcjHuFS4GOjfFFo8C1r3yLet6yfuZ0iS6H5X/Y5M/sRKyRA9ypCxXP9CZP1f7vrYOXkwYQhZAtuAs8InBssUaIK7TdMN1zcRGegZtYVpCKZNs+OM3KduHUr+tLNT2xXFQnchqfw5/lzbewP/nJIpmgPWEfeyhoXwYS7cAAVc3DGGwh8zRbk+yHLhCQt3gE+uXL1nWjVVs4Us4mjW/P//hhL0cpKCi1qXRF0LPHIea/lc/8TV6NltmScSxh9RIWF33o3ph3n5qVnmenBA8f/xRZR/wAAAA==',claude:'UklGRpYDAABXRUJQVlA4IIoDAABwEQCdASowADAAPl0ijEUjoiEY7mYAOAXEtgBOmV7AFHb8ewUHXozXGge4DzAdAD0AOkV9ADy2PZD/dT9o/Z1u4P6r4O+Gv0ufuxJu6TJNuhGUuIDSBTM/H79Lewb+rqN7WhMbQ44cH+GpeXw5ryDb37aLdg7/8mLruhtWL97ZkqHVyWlcZEr0ppkSWUXl4kJPZjwAAP7/vf38bz/wLi4cCvYVJ2rrZ5rjy4+fU0Yf6/Oiqn7LwHeu55JaseSEIw3jfSvMzI9IxM69l2wNIwoIgF94Nrl+RFgPk9RB9fMGxApcRT20Ic03WOKfizQCwJ5iFSRJ2PjHNkrtglYX1rqD9tpeLljxPwMJDdB/xSQ/Sjdy0tpb/NnP+FnR5JvYOVBa1h0uxcUkeH2wISTgpJicfiBGh+pZjCIA3298FuaLPjiZWCappJ3x2l6jQJsWnnJNfrZH7ZMrMbibtqepGz1PvmfK6dNN/zfdL+UfvjwbgYwqKi6QR2S1SB8oN8WEtPigIO2Kfcf1cOXBpz1tLwc/chLW/ezNNPgQm3oU7p49Xg9Yh1k2P7j4fNiEnIYZ4fOa58tOSVObpeOf1DaTxVBV11oHl04WRZ298NZVA4f1SG4ajjKD9zP+MO8BMS6qFNHhvg0WJT5QFxAqCwko9LfoEHdFqVlKKnw0YvNpKCvup/7BAu9al2UVj448sfhZRzKrLFgHaPldJHRSzpYx1C3HYfsv566rnMMc+A6G2wXoRJTcOLwTubIXI53Kvy/E35yORMYKFqyBcmvt+AEOhrDLwKi+CXlQE/Kd9WYKSJ7pqT5lOD5PWzybEKkxx5B2Bk8u2Iibw4FpIk+K35dlg5QWo6OZTV2eVPvBI1ZJ65reDXdmvi0fHke2jQcvpq3b/uqPLhkwFSFSBjBB7vH7KK19ELh2fn8n7rv40ssgWSfK+A9xAa0prQqny09xAavriSgzuEU3gQz1fKy+/yj+imIFiHXGzWdVGd3CyG+cJZvZjm5X3VOkyN/ptUTnHisTdHNsrQ8s+C2BsBBBMtsJQoF0JPitVTcWHaZCfzYllz4gXOLRL6Jxgp/68vXlYG4BGe+LNTidFatJswxdu15wNqlqLOOhZEpn83oxFhF47Rl94nDjiEia44HaNGHuKDrnVVkdFrH76bkB5p9NXq7HkdQ0AGy1goW01gRCQUtc23EN5SHDxmH2piy9gAA=',gemini:'UklGRhICAABXRUJQVlA4IAYCAABwDACdASowADAAPmEmjkUkIiEXFZhABgS2AFxw12lOAiqX9AxbupB6j9tb5mP2Z6i/oAdK96AHSV/uh+xxxgaQKZz5BONay9i2ZP+2aWlVSloC3Ae6XPBtWq0D1oXG3Q6KERBBS8c3f0gmgAAA/v/48VmIk+bN/2z1fTV7Y1+A/PpAI2Hrw07LPhdVEAwtS/zv90OhfdrdgVFP1GB5CoMliNaJ0Lj2VFSYhgMaX1FanIARcTU5MwySFu8vAsDt4ez8ugwSvwuGe0pvf++i+5aDmoP+jLCTVK1RmaFaL//IHEqGCic7466OxoY+s4tU87JvvLlejyQaeQXnlMHvA+4p9Gc99bu+nULUgfqG8lzkxvOYNIjr6R6avq8xSr3+pdAJtelmeU8yW2uqhQYejEJBYIsLPXoC/Zv/EH8fmfb+Rb8/OMNPRCvg2hd44Q9rQQenk2LKAHnn5B5xoWqMC2dris+fOGfl7LiN7mvONbwtkkdVmOOpPwSHXLISmBA2HwvkHf+Y0qXUNJ0ESyGsTmM+UB6/6GPgJpuA6aNZ316YFTofEOl+j1CUShUdQ0o1pV3J0rl424o56N+YMhn2UxBbFzXqZgbV5wF1U6r8aeH09QQM2MdRzwQ8yXTFT6qrLdxz0IxNUA0Mpf/nb4+Xjx5fXfc85KIeEmkZsKknHikefdqosNdgAA=='};
  const toolMap=[['Discord','discord'],['Cloudflare','cloudflare'],['Codex','codex'],['Claude Code','claude'],['Gemini','gemini']];
  toolMap.forEach(([title,key])=>{
    const el=[...document.querySelectorAll('.tool')].find(x=>x.getAttribute('title')===title);
    if(el) el.innerHTML=`<img class="brand-tool-icon" alt="${title}" src="data:image/webp;base64,${iconData[key]}">`;
  });
  const gh=[...document.querySelectorAll('.tool')].find(x=>x.getAttribute('title')==='GitHub');
  if(gh) gh.classList.add('tool-github-color');

  // Hero concept: denser, icon-led, with three visually identical status tags.
  const concept=document.querySelector('.hero-concept');
  if(concept) concept.innerHTML=`
    <div class="concept-head"><div class="concept-label">TASK-CENTERED WORKFLOW</div><div class="concept-badges"><span class="concept-badge">Checkpoint</span><span class="concept-badge">Handoff</span><span class="concept-badge">Next Agent</span></div></div>
    <div class="concept-track richer"><div class="concept-line"></div>
      <div class="concept-node discord"><div class="concept-icon"><svg viewBox="0 0 24 24"><path d="M6 8.5c0-1.4 1.1-2.5 2.5-2.5h7C16.9 6 18 7.1 18 8.5v5c0 1.4-1.1 2.5-2.5 2.5H11l-3.5 2v-2H8.5C7.1 16 6 14.9 6 13.5v-5Z"/></svg></div><span>Input</span><strong>Discord</strong></div><span class="concept-arrow">→</span>
      <div class="concept-node task"><div class="concept-icon"><svg viewBox="0 0 24 24"><path d="M8 7h8M8 12h8M8 17h5"/><path d="M5 7h.01M5 12h.01M5 17h.01"/></svg></div><span>Core</span><strong>Task</strong></div><span class="concept-arrow">→</span>
      <div class="concept-node active"><div class="concept-icon"><svg viewBox="0 0 24 24"><path d="M12 4v4M12 16v4M4 12h4M16 12h4"/><circle cx="12" cy="12" r="4"/></svg></div><span>Agent A</span><strong>Work</strong></div><span class="concept-arrow">→</span>
      <div class="concept-node handoff"><div class="concept-icon"><svg viewBox="0 0 24 24"><path d="M6 12h8"/><path d="m11 8 4 4-4 4"/><path d="M18 7v10"/></svg></div><span>Context</span><strong>Handoff</strong></div><span class="concept-arrow">→</span>
      <div class="concept-node next"><div class="concept-icon"><svg viewBox="0 0 24 24"><path d="M7 12a5 5 0 0 0 8.5 3.5L18 13"/><path d="M17 11a5 5 0 0 0-8.5-3.5L6 10"/></svg></div><span>Agent B</span><strong>Continue</strong></div>
    </div>
    <div class="concept-meta"><div class="concept-chip"><span class="chip-dot"></span>Goal · Decisions · Next action이 Task에 남습니다.</div><div class="concept-chip"><span class="chip-dot"></span>AI가 바뀌어도 같은 Task를 읽고 이어받습니다.</div></div>`;

  // Product Demo: move it directly below the tool strip so proof appears before the story.
  const demo=document.querySelector('.demo-video-block');
  const tools=document.querySelector('.tools-row');
  if(demo && tools){
    const head=demo.querySelector('.demo-video-head');
    if(head) head.innerHTML='<span class="demo-eyebrow">PRODUCT DEMO</span><strong>실제 Task가 Agent를 바꿔가며 이어지는 흐름</strong><p>Discord에서 Task를 만들고, Handoff로 다음 Agent에게 넘기고, Admin에서 같은 상태를 확인하는 실제 시연입니다.</p>';
    const stage=demo.querySelector('.demo-video-stage');
    if(stage) stage.innerHTML='<iframe src="https://www.youtube.com/embed/lg5cbHGhoUI?rel=0&modestbranding=1" title="AI Workspace 실제 시연 영상" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    const note=demo.querySelector('.demo-note'); if(note) note.remove();
    const shell=document.createElement('section'); shell.className='demo-section';
    const wrap=document.createElement('div'); wrap.className='wrap'; shell.appendChild(wrap); wrap.appendChild(demo);
    tools.insertAdjacentElement('afterend',shell);
  }

  // Future vision: 01 Handoff validation → 02 MCP expansion → 03 commercialization.
  const vision=[...document.querySelectorAll('section.section')].at(-1);
  if(vision){
    const list=vision.querySelector('.future-list');
    if(list){
      let items=[...list.querySelectorAll('.future-item')];
      let commercial=items.find(x=>x.textContent.includes('상업화'))||items[1];
      if(commercial){
        const no=commercial.querySelector('.future-no'); if(no) no.textContent='03';
        const p=commercial.querySelector('p'); const h3=commercial.querySelector('h3');
        if(p && h3){const span=document.createElement('span');span.className='future-inline';span.textContent=' '+p.textContent.trim();h3.appendChild(span);p.remove();}
      }
      if(!items.some(x=>x.textContent.includes('다양한 MCP 연결을 확장해보기'))){
        const mcp=document.createElement('div');mcp.className='future-item';mcp.innerHTML='<div class="future-no">02</div><div><h3>Task Admin을 Workflow의 Hub로 두고, 다양한 MCP 연결을 확장해보기.</h3></div>';
        if(commercial) list.insertBefore(mcp,commercial); else list.appendChild(mcp);
      }
    }
  }

  // Keep the current real TASK-0043 source, but crop the display to the header + checkpoint + handoff area.
  const taskFig=document.querySelector('.task-hires');
  if(taskFig) taskFig.classList.add('task-focus-crop');
  const proofs=document.querySelectorAll('.proof-shot');
  if(proofs.length>2) proofs[2].classList.add('task-proof-crop');

  const style=document.createElement('style');
  style.textContent=`
    .tools-label{font-size:11.5px!important}
    .tool{width:36px!important;height:36px!important}
    .brand-tool-icon{width:24px!important;height:24px!important;object-fit:contain!important;display:block!important}
    .tool-github-color{color:#181717!important}
    .tool-github-color svg{stroke:#181717!important;fill:none!important}
    .concept-badge{background:#f4fbfb!important;border-color:#b9d8d6!important;color:var(--accent-strong)!important;box-shadow:none!important;cursor:default!important}
    .hero-note{font-size:14px!important}
    .sec-kicker{font-size:12px!important}
    .sec-desc{font-size:17.5px!important}
    .intent-no{font-size:13px!important}
    .intent-copy p{font-size:16.5px!important}
    .questions p{font-size:18px!important}
    .center-lead{font-size:18.5px!important}
    .goal p,.goal-intro{font-size:17px!important}
    .feature-block strong{font-size:15px!important}
    .feature-block span{font-size:13px!important}
    .philosophy-line{font-size:19px!important}
    .wf-no{font-size:10.5px!important}
    .wf-node strong{font-size:15px!important}
    .wf-node small{font-size:13px!important}
    .proof-label{font-size:11.5px!important}
    .proof-shot figcaption{font-size:12.5px!important}
    .future-note{font-size:14.5px!important}
    .future-no{font-size:13px!important}
    .future-item h3{font-size:21px!important;line-height:1.58!important}
    .future-inline{font-size:16px!important;font-weight:400!important;color:var(--text)!important;letter-spacing:-.02em!important}
    .vision-ending{font-size:17px!important}
    .figcap{font-size:12.5px!important}
    .footer-inner{font-size:12.5px!important}
    .task-focus-crop{max-width:1040px!important;height:390px!important;overflow:hidden!important;background:#eef3f6!important}
    .task-focus-crop img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center top!important}
    .task-proof-crop img{object-fit:cover!important;object-position:center top!important}
    .demo-section{padding:54px 0 72px!important;border-bottom:1px solid var(--line)!important;background:#fff!important}
    .demo-section .demo-video-block{margin:0!important}
    .demo-section .demo-video-head{max-width:860px!important;margin-bottom:22px!important}
    .demo-section .demo-video-stage{position:relative!important;width:100%!important;max-width:1120px!important;aspect-ratio:16/9!important;border:1px solid var(--line)!important;border-radius:16px!important;overflow:hidden!important;background:#0f141b!important;box-shadow:0 18px 42px rgba(24,39,56,.10)!important}
    .demo-section .demo-video-stage iframe{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important}
    @media(max-width:640px){
      .sec-kicker{font-size:11.5px!important}
      .sec-desc{font-size:16.5px!important}
      .intent-copy p{font-size:15.5px!important}
      .questions p{font-size:17px!important}
      .goal p,.goal-intro{font-size:16px!important}
      .future-inline{display:block!important;margin-top:5px!important;font-size:15.5px!important}
      .task-focus-crop{height:250px!important}
      .demo-section{padding:42px 0 56px!important}
    }
  `;
  document.head.appendChild(style);
});