import listResponseMocks from './../../../places/api/mocks/list-response-mock';

export default () => {
  return listResponseMocks.items[Math.floor(Math.random()*listResponseMocks.items.length)];
};
