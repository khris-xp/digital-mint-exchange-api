# Digital Mint API

Your secure and user-friendly hub for buying and selling cryptocurrencies. Trade effortlessly with real-time data and a diverse range of assets. Explore the digital market confidently with us.

## Documentation

When I was working on the project, I had a design diagram of this project before starting to write the code to make it easier to write and reduce complexity while writing. In the database table, I separated Coin and Wallets are separated for ease of maintenance and scaling in the future. The main feature of the API is the ability to buy and sell coins and transfer coins to other users, including the price of coins that will adjust according to the amount of coins remaining. in the market

## API Reference

#### Sign Up

```
  POST /auth/sign-up
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required**. Your Username |
| `email`    | `string` | **Required**. Your Email    |
| `password` | `string` | **Required**. Your Password |

#### Sign In

```
  POST /auth/sign-in
```

| Parameter  | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `email`    | `string` | **Required**. Your Email    |
| `password` | `string` | **Required**. Your Password |

#### User Profile

```
  GET /auth/profile
```

| Token          | Type     | Description              |
| :------------- | :------- | :----------------------- |
| `Bearer Token` | `string` | **Required**. Your token |

### All Users

```
  GET /auth/users
```

| Token          | Type     | Description              |
| :------------- | :------- | :----------------------- |
| `Bearer Token` | `string` | **Required**. Your token |

### All coin

```
  GET /coin
```

| Token          | Type     | Description              |
| :------------- | :------- | :----------------------- |
| `Bearer Token` | `string` | **Required**. Your token |

#### Get coin by id

```
  GET /coin/{id}
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `id`      | `string` | **Required**. Your id |

#### Create Coin

```
  POST /coin
```

| Parameter    | Type     | Description                        |
| :----------- | :------- | :--------------------------------- |
| `name`       | `string` | **Required**. Your coin name       |
| `image`      | `string` | **Required**. Your coin image      |
| `max_supply` | `number` | **Required**. Your coin max supply |
| `rate`       | `number` | **Required**. Your coin rate       |

#### Update Coin

```
  PUT /coin
```

| Parameter    | Type     | Description                        |
| :----------- | :------- | :--------------------------------- |
| `name`       | `string` | **Required**. Your coin name       |
| `image`      | `string` | **Required**. Your coin image      |
| `max_supply` | `number` | **Required**. Your coin max supply |
| `rate`       | `number` | **Required**. Your coin rate       |

#### Delete coin

```
  DELETE /coin/{id}
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `id`      | `string` | **Required**. Your id |

### All wallet

```
  GET /wallet
```

| Token          | Type     | Description              |
| :------------- | :------- | :----------------------- |
| `Bearer Token` | `string` | **Required**. Your token |

#### Get wallet by id

```
  GET /wallet/{id}
```

| Parameter | Type     | Description           |
| :-------- | :------- | :-------------------- |
| `id`      | `string` | **Required**. Your id |

#### Add Token to wallet

```
  POST /wallet
```

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `coin_id` | `string` | **Required**. Your coin id     |
| `amount`  | `string` | **Required**. Your coin amount |

#### Sell Token to wallet

```
  POST /wallet/sell
```

| Parameter | Type     | Description                    |
| :-------- | :------- | :----------------------------- |
| `coin_id` | `string` | **Required**. Your coin id     |
| `amount`  | `string` | **Required**. Your coin amount |

#### Delete coin

```
  DELETE /wallet/transfer
```

| Parameter     | Type     | Description                         |
| :------------ | :------- | :---------------------------------- |
| `coin_id`     | `string` | **Required**. Your coin id          |
| `amount`      | `string` | **Required**. Your coin amount      |
| `transfer_id` | `string` | **Required**. Your user transfer id |

## Authors

- [@khris-xp](s://github.com/khris-xp)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
`DB_TYPE`
`DB_HOST`
`DB_PORT`
`DB_USERNAME`
`DB_PASSWORD`
`DB_DATABASE`
`JWT_SECRET`
`COINMARKETCAP_API_KEY`

## Tech Stack

**Server:** Nestjs, Postgresql
