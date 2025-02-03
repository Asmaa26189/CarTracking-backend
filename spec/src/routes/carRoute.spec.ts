import app from '../../src/app';
import supertest from 'supertest';
import router from '../../src/routes/Car';

const request = supertest(app);