import TypeObjectStore from '../type';

const webReservation = {
  keyPath: 'reservationId',
  indexs: [
    'title',
    'price',
    'pictureURL',
    'date',
    'nights',
    'guests',
    'infants',
    'city'
  ]
};

const reservationsObjectStore: TypeObjectStore = {
  reservations: webReservation
};

export default reservationsObjectStore;
