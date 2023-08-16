// import {getConnection} from '../lib/db'
import {config} from 'dotenv'; config();

describe('serverless', () => {
  describe('env vars', () => {
    test('expose config vars via environment', () => {
      expect(process.env.DB_HOST).not.toBe(undefined)
      expect(process.env.DB_HOST).toMatch(/^localhost/)
    })
  })
})