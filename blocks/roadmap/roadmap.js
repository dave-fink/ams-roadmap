import { div, ul, li } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const raodMapData = block.querySelector('a').href;

  block.innerHTML = '';
  fetch(raodMapData)
    .then((response) => response.json())
    .then((data) => {
      const roadmapData = data.data;

      // Group data by year and quarter
      const groupedData = {};
      roadmapData.forEach(({
        Year: year,
        Quarter: quarter,
        Project: text,
        Tooltip: tip,
        Page: path,
      }) => {
        if (!groupedData[year]) {
          groupedData[year] = {};
        }
        if (!groupedData[year][quarter]) {
          groupedData[year][quarter] = [];
        }
        groupedData[year][quarter].push({
          text,
          tip,
          path,
        });
      });

      // Create an <ul> list for each year and quarter
      const $roadMapUl = ul({ class: 'road-map' });
      Object.keys(groupedData).forEach((year) => {
        const $yearLi = li({ class: 'year' }, year);
        const $quarterUl = ul({ class: 'quarter' });
        Object.keys(groupedData[year]).forEach((quarter) => {
          const $quarterLi = li(quarter);
          const $projectUl = ul({ class: 'projects' });
          groupedData[year][quarter].forEach((project) => {
            const $projectLi = li({
              'data-tip': project.tip,
              'data-path': project.path,
            },
              project.text,
              div({ class: 'tooltip' }, div(project.tip)),
            );
            $projectUl.appendChild($projectLi);
          });
          $quarterLi.appendChild($projectUl);
          $quarterUl.appendChild($quarterLi);
        });
        $yearLi.appendChild($quarterUl);
        $roadMapUl.appendChild($yearLi);
      });

      block.appendChild($roadMapUl);
    })
    .catch((error) => {
      console.error('Error fetching roadmap data:', error);
    });
}
