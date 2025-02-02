# Coding Standards
## 1. Project Structure
Follow a consistent and modular project structure. Example:

```javascript
project-root/
├── src/
│   ├── controllers/       # Route handlers
│   ├── models/            # Database models
│   ├── routes/            # Route definitions
│   ├── services/          # Business logic
│   ├── utils/             # Utility functions
│   ├── middleware/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── tests/             # Test files
│   └── app.js             # Main application file
├── .env                   # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## 2. Naming Conventions
### Variables and Functions: Use camelCase.

```javascript
let userName = "John";
function getUserDetails() {}
```

### Constants: Use UPPER_SNAKE_CASE.

```javascript
const MAX_USERS = 100;
```
### Classes: Use PascalCase.

```javascript
class UserController {}
```

### Files and Directories: Use kebab-case.

```javascript
user-controller.ts
```
### Avoid using abrreviation for variable and function name

## 3. Code Formatting
- Use <b>ESLint</b> and <b>Prettier</b> for consistent code formatting.

- Use 2 spaces for indentation (no tabs).

- Always use semicolons.

- Use single quotes for strings.

```javascript
const message = 'Hello, World!';
```

- Use trailing commas for multiline objects and arrays.

```javascript
const user = {
  name: 'John',
  age: 30,
};
```
## 4. Error Handling
- Use async/await with try/catch for error handling.

```javascript
try {
  const data = await someAsyncFunction();
} catch (error) {
  console.error('Error:', error.message);
}
```
- Always handle errors in middleware and log them.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

## 5. Environment Variables
- Use the dotenv package to manage environment variables.

- Store sensitive data (e.g., API keys, database credentials) in a .env file.

```bash
# .env
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydb
```
## 6. Testing
- Write unit and integration tests using Jest or Mocha.

- Place test files in the tests/ directory.

```javascript
// tests/user.test.js
const request = require('supertest');
const app = require('../app');

describe('GET /users', () => {
  it('should return all users', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toEqual(200);
  });
});
```

## 7. Logging
- Use a logging library like Winston or Morgan.

- Log important events (e.g., errors, API requests).

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.info('Server started on port 3000');
```


## 8. Version Control
- Use Git for version control.

- Follow a branching strategy like Git Flow.

- Write clear and concise commit messages.

```
feat: add user authentication
fix: resolve issue with login API
docs: update README file
```
