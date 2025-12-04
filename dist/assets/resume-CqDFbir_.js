import"./modulepreload-polyfill-B5Qt9EMX.js";async function o(){try{const n=await(await fetch("/src/data/projects.json")).json(),t=document.getElementById("projects-content");for(const[i,s]of Object.entries(n)){const l=r(s,i);t.appendChild(l)}}catch(e){console.error("Error loading projects:",e)}}function r(e,n){const t=document.createElement("article");t.className="project",t.setAttribute("itemscope",""),t.setAttribute("itemtype","https://schema.org/CreativeWork");let i=`
        <div class="project-header">
          <h3 class="project-title" itemprop="name">${e.title}</h3>
          <p class="project-role" itemprop="description">${e.description||e.role||"Product Designer"}</p>
          ${e.slug?`<p class="project-link"><a href="/${e.slug}" itemprop="url">View Case Study →</a></p>`:""}
        </div>
      `;return e.overview?i+=`<p itemprop="about">${e.overview}</p>`:e.subtitle&&(i+=`<p itemprop="about">${e.subtitle}</p>`),e.contentSrc&&(i+="<h4>Key Deliverables & Responsibilities</h4>",i+="<ul>",e.title.includes("Design System")?i+=`
            <li>Architected comprehensive design system from scratch with scalable component library</li>
            <li>Implemented design tokens workflow with automated synchronization between Figma and codebase</li>
            <li>Created extensive design documentation and usage guidelines for development teams</li>
            <li>Conducted workshops and training sessions for design and development teams</li>
            <li>Established governance model and contribution guidelines for system evolution</li>
          `:e.title.includes("Marketing")?i+=`
            <li>Led end-to-end product design for B2B marketing management platform</li>
            <li>Conducted user research and usability testing with marketing professionals</li>
            <li>Designed intuitive dashboard interfaces with complex data visualization</li>
            <li>Created responsive, accessible UI components following WCAG standards</li>
            <li>Collaborated with engineering team on frontend implementation and design handoff</li>
          `:e.title.includes("Energy")?i+=`
            <li>Designed user-friendly tracking interface for energy switching process</li>
            <li>Simplified complex multi-step workflows into intuitive user journeys</li>
            <li>Created responsive microsite optimized for mobile and desktop experiences</li>
            <li>Implemented clear visual hierarchy and progress indicators</li>
            <li>Conducted A/B testing to optimize conversion rates</li>
          `:e.title.includes("Figma")&&(i+=`
            <li>Developed Figma plugin to streamline design distribution workflow</li>
            <li>Designed plugin UI following Figma's design guidelines and best practices</li>
            <li>Created user-friendly interface for complex file management operations</li>
            <li>Implemented error handling and user feedback mechanisms</li>
            <li>Documented plugin usage and best practices for design teams</li>
          `),i+="</ul>"),e.tags&&e.tags.length>0&&(i+="<h4>Skills & Technologies</h4>",i+=`<p itemprop="keywords">${e.tags.join(", ")}</p>`),t.innerHTML=i,t}o();
