const body = document.querySelector('body');
const buttons = document.querySelectorAll('.menu_button');
const open = document.querySelector('.open_button');

const dates = document.querySelectorAll('#date');
const year = new Date().getFullYear();
const backdrop = document.querySelector('.dialog_modal::backdrop');

let videoData = [];
const gridWrap = document.querySelector('[data-grid="video"]');

function copyright() {
  dates.forEach((date) => {
    date.textContent = year;
  });
}

function menuToggle() {
  if (open) {
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const isActive = body.classList.toggle('menu_active');
        if (isActive) {
          open.setAttribute('aria-expanded', 'true');
        } else {
          open.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

function escapeToggle() {
  if (open) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && body.classList.contains('menu_active')) {
        body.classList.remove('menu_active');
        open.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

function createDialog() {
  const videos = document.querySelectorAll('.article');
  videos.forEach((video) => {
    const button = video.querySelector('.play_video');
    const title = video.querySelector('.video_title');
    button.addEventListener('click', (e) => {
      // create dialog
      const grid = document.querySelector('.grid');
      const dialog = document.createElement('dialog');
      dialog.classList.add('dialog_modal');
      grid.insertAdjacentElement('afterend', dialog);

      // create close button
      const closeButton = document.createElement('button');
      closeButton.classList.add('close_dialog');
      closeButton.setAttribute('aria-label', 'Close Video');
      closeButton.innerHTML =
        '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/></svg>';
      dialog.insertAdjacentElement('afterbegin', closeButton);

      // create iframe
      const id = e.currentTarget.dataset.attribute;
      const type = e.currentTarget.dataset.type;
      console.log(id, type, title.textContent);
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${id}`);
      iframe.setAttribute('title', title.textContent);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute(
        'allow',
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      );
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('allowfullscreen', '');
      dialog.insertAdjacentElement('beforeend', iframe);

      // show modal dialog
      dialog.showModal();
      body.classList.add('dialog');

      // remove modal dialog
      closeButton.addEventListener('click', () => {
        dialog.remove();
        body.classList.remove('dialog');
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  menuToggle();
  escapeToggle();
  copyright();
  
});

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:3000/videos');
    if (!response.ok) throw new Error(`HTTP error. status: ${response.status}`);

    videoData = await response.json();

    createCards(videoData);
    createDialog();
  } catch (err) {
    console.error('Failed to fetch data', err);
  }
};

const createIcon  = (pathD) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('viewBox', '0 0 512 512');
  svg.classList.add('ionicon');
  path.setAttribute('d', pathD);
  path.setAttribute('fill', 'currentColor');

  svg.appendChild(path);
  return svg;
};

const createCards = () => {
  videoData.map((video) => {
    const { id, type, title, url, image } = video;

    //   Create Elements
    const art = document.createElement('article');
    const fig = document.createElement('figure');
    const img = document.createElement('img');
    const btn = document.createElement('button');
    const icon = createIcon(
      'M 133 440 a 35.37 35.37 0 0 1 -17.5 -4.67 c -12 -6.8 -19.46 -20 -19.46 -34.33 V 111 c 0 -14.37 7.46 -27.53 19.46 -34.33 a 35.13 35.13 0 0 1 35.77 0.45 l 247.85 148.36 a 36 36 0 0 1 0 61 l -247.89 148.4 A 35.5 35.5 0 0 1 133 440 Z'
    );
    const h3 = document.createElement('h3');
    const p = document.createElement('p');

    //   Add classes to Elements
    art.classList.add('article');
    fig.classList.add('figure');
    btn.classList.add('play_video');
    icon.classList.add('ionicon');
    h3.classList.add('video_title');
    p.classList.add('video_type');

    //  Add innerText to Elements
    h3.innerText = title;
    p.innerText = 'YouTube';

    //   Add attributes to Elements
    img.setAttribute('src', image);
    img.setAttribute('alt', title);

    btn.setAttribute('data-attribute', id);
    btn.setAttribute('data-type', 'youtube');
    btn.setAttribute('aria-label', 'Play Video');

    //   Add Elements to the DOM

    gridWrap.appendChild(art);
    art.appendChild(fig);
    art.appendChild(h3);
    art.appendChild(p);

    fig.insertAdjacentElement('afterbegin', img);
    fig.insertAdjacentElement('beforeend', btn);

    btn.appendChild(icon);
  });
};
