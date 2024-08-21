import { div, ul, li, p, a } from '../../scripts/dom-helpers.js';


function animateProjects(action, $quarter) {
  const $projects = Array.from($quarter.querySelectorAll('.p'));
    $projects.forEach(($project, i) => {
      if (action === 'in') {
        setTimeout(() => {
          $project.classList.add('show');
        }, i * 160);
      } else if (action === 'out') {
        $project.classList.remove('show');
      }
    });
}

export default function decorate(block) {
  const roadMapDataUrl = block.querySelector('a').href;

  block.innerHTML = '';

  fetch(roadMapDataUrl)
    .then((response) => response.json())
    .then((data) => {
      const roadmapData = data.data;

      // Group data by year and quarter
      const groupData = roadmapData.reduce((acc, { Year, Quarter, Project, Tooltip, Page }) => {
        acc[Year] = acc[Year] || {};
        acc[Year][Quarter] = acc[Year][Quarter] || [];
        acc[Year][Quarter].push({ text: Project, tip: Tooltip, path: Page });
        return acc;
      }, {});

      // Create the <ul> list for years
      const $years = ul({ class: 'years' });
      Object.entries(groupData).forEach(([year, quarters]) => {
        const $year = li({ class: 'y' }, year);

        const $quarters = ul({ class: 'quarters' });
        Object.entries(quarters).forEach(([quarter, projects]) => {
          const $quarter = li({ class: 'q', id: `Y${year}-${quarter}` }, quarter);

          const $projects = ul({ class: 'projects' });
          projects.forEach(({ text, tip, path }) => {
            const $project = li({ class: 'p' },
              div(
                text,
                div({ class: 'tooltip' },
                  div(
                    tip,
                    p(a({ class: 'btn', href: path }, 'Learn more')),
                  ),
                ),
              ),
            );

            // add click event to make active
            $project.addEventListener('click', () => {
              $years.querySelectorAll('.active').forEach(($p) => $p.classList.remove('active'));
              $project.classList.toggle('active');
            });


            $projects.appendChild($project);
          });

          $quarters.appendChild($quarter);
          $quarter.appendChild($projects);
        });

        $years.appendChild($year);
        $year.appendChild($quarters);
      });

      // add intersection observer and if $years.querySelectorAll('.q') is intersecting, showProjects($quarter)
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateProjects('in', entry.target);
          } else {
            animateProjects('out', entry.target);
          }
        });
      }, {
        threshold: [0.20]
      });


      // Add click event to quarters and animate in projects
      $years.querySelectorAll('.q').forEach(($quarter) => {
        $quarter.addEventListener('click', () => {
          animateProjects('in', $quarter);
          });
        observer.observe($quarter);
      });




      block.appendChild($years);
    })
    .catch((error) => {
      console.error('Error fetching roadmap data:', error);
    });








}
