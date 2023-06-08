import Notiflix from 'notiflix';
import axios from 'axios';

import { loaderIconRef } from './takingRefs';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37108036-8a6d23bc06a2bda3e904321d5';

class APIHandler {
  constructor(dataToSearch, languageOfData) {
    this.page = 1;

    this.params = new URLSearchParams({
      key: API_KEY,
      q: dataToSearch,
      lang: languageOfData,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
    });
  }

  incrementPageCounter() {
    this.page++;
  }

  async checkData(data) {
    if (this.page === 1 && data.length === 0) {
      Notiflix.Notify.failure('Cannot find photos on this topic');
    }
  }

  async fetchItemsByvalue() {
    loaderIconRef.classList.remove('hidden');

    try {
      const response = await axios.get(
        `${BASE_URL}?${this.params}&page=${this.page}`
      );
      const data = response.data;

      this.checkData(data.hits);

      return data.hits;
    } catch {
      throw new Error('No more photos on this topic');
    }
  }
}

export { APIHandler };
