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

  checkData(data) {
    if (data.length === 0) {
      if (this.page === 1) {
        throw new Error('Cannot find photos on this topic');
      }

      throw new Error('No more photos on this topic');
    }
  }

  async fetchItemsByvalue() {
    loaderIconRef.classList.remove('hidden');

    const response = await axios
      .get(`${BASE_URL}?${this.params}&page=${this.page}`)
      .catch(() => {
        throw new Error('Out of range');
      });

    const data = response.data;
    this.checkData(data.hits);

    return data.hits;
  }
}

export { APIHandler };
