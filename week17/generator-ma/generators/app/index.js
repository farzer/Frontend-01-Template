const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  async prompting() {
    this.answers = await this.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'your project title'
      }
    ])
  }
  writing() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      { title: this.answers.title }
    );
  }
};