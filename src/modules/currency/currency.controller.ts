import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import axios from 'axios';

@Controller('currency')
export class CurrencyController {
  @Get()
  async proxy(@Req() req: Request, @Res() res, @Query() query) {
    try {
      const { start = 1, limit = 10 } = query;
      const apiResponse = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': 'd631b256-b800-4f3d-a805-9d75c92d456c',
            'Content-Type': 'application/json',
          },
        },
      );

      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');

      res.send(apiResponse.data);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal Server Error');
    }
  }
}
