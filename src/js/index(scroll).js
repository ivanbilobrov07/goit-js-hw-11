import OnlyScroll from 'only-scrollbar';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import {
  galleryRef,
  searchFormRef,
  loaderIconRef,
  galleryControlersRef,
  galleryWrappersRef,
} from './js-helpers-2/takingRefs';
import { APIHandler } from './js-helpers-2/pixabay-api';
import { createMarkup } from './js-helpers-2/createMarkup';

const generateMarkup = async data => {
  loaderIconRef.classList.add('hidden');
  galleryRef.insertAdjacentHTML('beforeend', await createMarkup(data));

  galleryControlersRef.style.position = 'relative';
  loaderIconRef.style.top = 'calc(100% - 50px)';
};

const handleObserverEvent = async (entries, observer) => {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      apiHandler.incrementPageCounter();

      try {
        const dataFromAPI = await apiHandler.fetchItemsByvalue();
        await generateMarkup(dataFromAPI);
        lightbox.refresh();
      } catch (e) {
        loaderIconRef.classList.add('hidden');
        observer.unobserve(galleryControlersRef);
        Notiflix.Notify.failure(e.message);
      }
    }
  });
};

const handleFormSubmit = async e => {
  e.preventDefault();

  galleryRef.innerHTML = '';
  galleryControlersRef.style.position = 'static';
  loaderIconRef.style.top = '50%';

  const formRef = e.currentTarget;

  let dataToSearch = formRef.elements.searchQuery.value;
  const languageOfData = formRef.elements.language.value;

  apiHandler = new APIHandler(dataToSearch, languageOfData);

  try {
    const dataFromAPI = await apiHandler.fetchItemsByvalue();
    await generateMarkup(dataFromAPI);
  } catch (e) {
    loaderIconRef.classList.add('hidden');
    Notiflix.Notify.failure(e.message);
  }

  formRef.elements.searchQuery.value = '';

  const scroll = new OnlyScroll(window, {
    damping: 0.8,
  });

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  var options = {
    root: null,
    rootMargin: '300px',
    threshold: 1.0,
  };
  const observer = new IntersectionObserver(handleObserverEvent, options);
  observer.observe(galleryControlersRef);
};

let apiHandler, lightbox;

searchFormRef.addEventListener('submit', handleFormSubmit);
