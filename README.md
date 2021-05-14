# LinkApi Notifications ❓

> LinkApi Notifications

[![GitHub followers](https://img.shields.io/github/followers/jlenon7.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/jlenon7?tab=followers)
[![GitHub stars](https://img.shields.io/github/stars/easycontabil/ESC-Question.svg?style=social&label=Star&maxAge=2592000)](https://github.com/easycontabil/ESC-Guard/stargazers/)

<p>
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/easycontabil/ESC-Guard?style=for-the-badge&logo=appveyor">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/easycontabil/ESC-Guard?style=for-the-badge&logo=appveyor">

  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen?style=for-the-badge&logo=appveyor">
</p>

`LinkApi Notifications` Service.

<img src="https://lh6.googleusercontent.com/proxy/hOeonBmKOFIP0jKO2_RteKyBD0Hb-8RGR630XEa-drl0ZXRibxQ0ucznkt4PAiwlIWIe2NEJ2PAx3p11rpY5mUM6LcsGFkDvCNjvkRAMN6syBWYhWv9y=w1200-h630-p-k-no-nu" width="200px" align="right" hspace="30px" vspace="100px">

## 🚀 Running the project 

Install dependencies

```bash
yarn
```

Generate the archive .env and change the connection of `Redis` and `MongoDB`

```bash
cp .env.example .env && cp .env.example .env.testing
```

To run E2E and Unit tests without logs

```bash
yarn test
```

To run E2E and Unit tests with debug logs

```bash
yarn test:debug
```

To run the application in development mode without debug logs

```bash
yarn start:dev
```

To run the application in development mode with debug logs

```bash
yarn start:debug:dev
```

---

## 🏗️ Architecture 

### Single module architecture

#### History

The heart of the project is within `start/kernel.ts`, `app/AppModule.ts` and `providers/ApplicationProvider`. `start/kernel.ts` is where an array of imports is created to be used within NestJS, this array is always called in the imports of the AppModule, and he loads some of the `config/*.ts` files from the project.

`providers/ApplicationProvider` load all the providers (services, repositories, models, guards, middlewares, pipes and controllers) from the application, AppModule will call ApplicationProvider as a `Singleton` and `constructor` will execute all the boot methods inside it and creating arrays to use inside AppModule providers and controllers. Basically if you need to create a new `controller` or `service`, you don't need to pass it into the AppModule, just create the file and let ApplicationProvider take care of the rest.

#### Project Structure

🛑 Is extremely important to follow this project structure to `providers/ApplicationProvider` works. 🛑

```
app
├── Contracts
│   ├── Dtos
│   ├── *Contract.ts
├── Http
│   ├── Filters
│   ├── Guards
│   ├── Interceptors
│   ├── Middlewares
│   ├── *Controller.ts
├── Validators
│   ├── *Validator.ts
├── Decorators
|   ├── Http
|   ├── Validators
│   ├── *.ts
├── Models
│   ├── *.ts
├── Pipes
│   ├── *Pipe.ts
├── Repositories
│   ├── *Repository.ts
├── Services
│   ├── Api
│   ├── Collections
│   ├── Utils
├── AppModule.ts
config
├── *.ts
database
├── *.ts
├── *.sql
providers
├── *.ts
├── ApplicationProvider.ts
start
├── chalk.ts
├── debug.ts
├── env.ts
├── kernel.ts
├── main.ts
test
├── E2E
│   ├── Resource Name
├── Unit
│   ├── Resource Name
├── Utils
│   ├── App.ts
│   ├── Database.ts
```

---

## 🧩 Resources 

### Swagger Collections

Just run the project and enter inside `${your.url}/portal/swagger` in your browser to see the Swagger Collections.

---

## 📝 License

This project is under MIT license. See the archive [LICENSE](LICENSE) for more details.

---

Made with 🖤 by jlenon7 :wave:
