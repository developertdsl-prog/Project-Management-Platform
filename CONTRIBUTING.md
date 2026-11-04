# Contributing to Project Management Platform

Thank you for considering contributing to the Project Management Platform! This document outlines the contribution process.

## Code of Conduct

Please be respectful and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone git@github.com:your-username/Project-Management-Platform.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies:
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```
5. Set up environment variables:
   ```bash
   cd server && cp .env.example .env
   # Edit .env with your configuration
   ```
6. Start development servers:
   ```bash
   cd server && npm run dev
   cd ../client && npm start
   ```

## Development Workflow

1. Create a feature branch from `develop`
2. Implement your changes
3. Make meaningful commits using conventional commit messages:
   - `feat: add new feature`
   - `fix: resolve issue`
   - `docs: update documentation`
   - `test: add tests`
   - `chore: update dependencies`
4. Push your branch: `git push origin feature/your-feature-name`
5. Open a pull request targeting `develop`
6. Wait for code review and merge

## Branch Naming

- `main` - Production stable branch
- `develop` - Integration branch
- `feature/*` - Feature development branches
- `fix/*` - Bug fix branches
- `docs/*` - Documentation updates

## Pull Request Requirements

Every PR should include:
- Clear title describing the change
- Description of what was implemented
- List of technical changes
- Related issue numbers
- Testing performed
- Screenshots (for UI changes)
- Remaining limitations

## Code Style

- Use conventional commit messages
- Write meaningful variable and function names
- Add comments for complex logic
- Follow existing file structure
- Keep components small and reusable
- Handle errors gracefully

## Reporting Issues

When reporting bugs, include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if UI related)
- Environment details (browser, OS, etc.)

## License

ISC License