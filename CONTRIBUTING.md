# Contributing to TypeShi

Thank you for your interest in contributing to **TypeShi**! 🎉

We welcome contributions from everyone. Whether you are fixing a bug, improving the design, adding sound profiles, or enhancing documentation, your help is appreciated.

---

## Code of Conduct

Please be respectful, constructive, and considerate in all interactions within this project.

---

## How Can I Contribute?

### Reporting Bugs
- Check the [GitHub Issues](https://github.com/ayaanshilledar/Typshiii/issues) to make sure the issue hasn't already been reported.
- Open a new issue with a clear title and description, steps to reproduce, expected vs. actual behavior, and browser/OS details.

### Suggesting Enhancements
- Open an issue describing your idea, use case, and potential implementation.
- Feature discussions help ensure changes align with the project roadmap before code is written.

### Submitting Pull Requests (PRs)
1. **Fork the repository** on GitHub.
2. **Clone your fork**:
   ```bash
   git clone https://github.com/<your-username>/Typshiii.git
   cd Typshiii
   ```
3. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Make your changes** and ensure code runs cleanly without errors:
   ```bash
   npm run dev
   ```
6. **Commit your changes**:
   ```bash
   git commit -m "feat: add your descriptive feature commit message"
   ```
7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request** against the `main` branch with a clear summary of your changes.

---

## Development Guidelines

- **TypeScript**: Ensure strict typing and avoid `any` wherever possible.
- **Styling**: Use Tailwind CSS and follow the established dark aesthetic design tokens.
- **Performance**: Zero input latency is critical for a typing test app. Minimize re-renders and keep typing input paths lightweight.

---

## License

By contributing to TypeShi, you agree that your contributions will be licensed under the [MIT License](LICENSE).
