/* eslint-disable no-use-before-define, object-curly-newline, function-paren-newline */
import { div, ul, li, p, a } from '../../scripts/dom-helpers.js';
import { scrollToMe, fixYears } from '../../scripts/animations.js';

export default function decorate(block) {
  const roadMapDataUrl = block.querySelector('a').href;
  let activePos;
  let posIndex = 0;

  block.innerHTML = '';

  fetch(roadMapDataUrl)
    .then((response) => response.json())
    .then((data) => {
      const roadmapData = data.data;

      // Group data by year and quarter
      const groupData = roadmapData.reduce((acc, {
        Year,
        Quarter,
        Start,
        Project,
        Tooltip,
        Page,
      }) => {
        acc[Year] = acc[Year] || {};
        acc[Year][Quarter] = acc[Year][Quarter] || [];
        acc[Year][Quarter].push({
          Start,
          text: Project,
          tip: Tooltip,
          path: Page,
        });
        return acc;
      }, {});

      // todo: style these
      const $heading = div({ class: 'heading' }, 'Roadmap');
      const $disclaimer = div({ class: 'disclaimer' }, 'Note: This roadmap is subject to change.');

      // Create the <ul> list for years
      const $years = ul({ class: 'years' });
      Object.entries(groupData).forEach(([year, quarters], i) => {
        const $year = li({ class: `y clr-${i}` }, '\u00A0', div(year));

        const $quarters = ul({ class: 'quarters' });
        Object.entries(quarters).forEach(([quarter, projects]) => {
          posIndex += 1;
          const pos = posIndex;

          const $quarter = li({ class: 'q', 'data-i': pos }, quarter);

          // handle start quarter
          if (projects.some(({ Start }) => Start === 'here')) {
            $quarter.classList.add('start');
            activePos = pos;
          }

          const $projects = ul({ class: 'projects' });
          projects.forEach(({ text, tip, path }, n) => {
            const $project = li({ class: 'p', style: `--index:${n}` },
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

            // add click event to make active & show info
            $project.addEventListener('click', () => {
              $years.querySelectorAll('.active')
                .forEach(($p) => $p.classList.remove('active'));
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

      // intersection observer to fade in quarters
      const quarterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          // todo: check elements are fading
          if (entry.isIntersecting) {
            entry.target.classList.add('on');
          } else {
            entry.target.classList.remove('on');
          }
        });
      }, {
        threshold: [0.20],
      });
      $years.querySelectorAll('.q').forEach(($quarter) => {
        quarterObserver.observe($quarter);
      });

      // todo: check if target is more than scroll distance
      function scroll(dir) {
        activePos += dir;
        const target = block.querySelector(`[data-i="${activePos}"]`);
        if (target) { scrollToMe(block, target, 500); }
        // close all active projects
        $years.querySelectorAll('.active').forEach(($a) => $a.classList.remove('active'));
      }
      const $left = div({ class: 'left' }, div());
      $left.addEventListener('click', () => scroll(-1));
      const $right = div({ class: 'right' }, div());
      $right.addEventListener('click', () => scroll(1));

      block.append(
        $heading,
        $years,
        $left,
        $right,
        $disclaimer);

      // scroll to start here item when in view
      const roadMapObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const startHere = block.querySelector('.start');

            scrollToMe(block, startHere, 2000);
          }
        });
      }, {
        threshold: [0.20],
      });
      roadMapObserver.observe(block);

      fixYears(block, block.querySelectorAll('.y'));
    })
    .catch((error) => {
      console.error('Error fetching roadmap data:', error);
    });
}
