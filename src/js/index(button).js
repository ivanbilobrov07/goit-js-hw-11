import OnlyScroll from 'only-scrollbar';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import {
  galleryRef,
  searchFormRef,
  loadMoreBtnRef,
  loaderIconRef,
  galleryControlersRef,
} from './js-helpers-1/takingRefs';
import { APIHandler } from './js-helpers-1/pixabay-api';
import { createMarkup } from './js-helpers-1/createMarkup';

const generateMarkup = async data => {
  loaderIconRef.classList.add('hidden');
  galleryRef.insertAdjacentHTML('beforeend', await createMarkup(data));

  galleryControlersRef.style.position = 'relative';
  loadMoreBtnRef.classList.remove('hidden');
  loaderIconRef.style.top = 'calc(100% - 50px)';
};

const handlLoadMoreBtnClick = async () => {
  apiHandler.incrementPageCounter();
  loadMoreBtnRef.classList.add('hidden');
  try {
    const dataFromAPI = await apiHandler.fetchItemsByvalue();
    await generateMarkup(dataFromAPI);
    lightbox.refresh();
  } catch (e) {
    loaderIconRef.classList.add('hidden');
    Notiflix.Notify.failure(e.message);
  }
};

const handleFormSubmit = async e => {
  e.preventDefault();

  loadMoreBtnRef.removeEventListener('click', handlLoadMoreBtnClick);

  galleryRef.innerHTML = '';
  loadMoreBtnRef.classList.add('hidden');
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

  const scroll = new OnlyScroll(document.querySelector('.gallery'), {
    damping: 0.8,
  });

  lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  loadMoreBtnRef.addEventListener('click', handlLoadMoreBtnClick);
};

let apiHandler, lightbox;

searchFormRef.addEventListener('submit', handleFormSubmit);
