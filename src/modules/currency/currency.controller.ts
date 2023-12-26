import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  async proxy(@Req() req: Request, @Res() res, @Query() query) {
    try {
      const apiKey = this.configService.get<string>('COINMARKETCAP_API_KEY');
      const { start = 1, limit = 10 } = query;
      const apiResponse = await axios.get(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': apiKey,
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
