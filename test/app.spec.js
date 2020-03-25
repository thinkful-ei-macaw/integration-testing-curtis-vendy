const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
  it('should return array of movies', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1)
        const movie = res.body[0];
        expect(movie).to.include.all.keys(
          'App', 'Category', 'Genres', 'Ratings', 'Price'
        );
      });
  });

  it('should be 400 if sort is incorrect', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'MISTAKE' })
      .expect(400, 'Sort must be one of genres or sort');
  });
  it('should sort by title', () => {
    return supertest(app)
      .get('/apps')
      .query({ sort: 'title' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let sorted = true;

        let i = 0;
        // iterate once less than the length of the array
        // because we're comparing 2 items in the array at a time
        while (i < res.body.length - 1) {
          // compare movie at `i` with next movie at `i + 1`
          const movieAtI = res.body[i];
          const movieAtIPlus1 = res.body[i + 1];
          // if the next movie is less than the book at i,
          if (movieAtIPlus1.Rating < movieAtI.Rating) {
            // the movie were not sorted correctly
            sorted = false;
            break; // exit the loop
          }
          i++;
        }
        expect(sorted).to.be.true;
      });
  });

});


// describe