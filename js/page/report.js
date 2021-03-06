var ReportPage = React.createClass({
  submitMessage: function() {
    if (this._messageArea.value) {
      this.setState({
        submitting: true
      });
      lbry.reportBug(this._messageArea.value, () => {
        this.setState({
          submitting: false
        });
        alert("Your bug report has been submitted! Thank you for your feedback.");
      });
      this._messageArea.value = '';
    }
  },
  getInitialState: function() {
    return {
      submitting: false,
    }
  },
  render: function() {
    return (
      <main className="page">
        <SubPageLogo />
        <h1>Report a bug</h1>
        <section>
        <p>Please describe the problem you experienced and any information you think might be useful to us. Links to screenshots are great!</p>
        <textarea ref={(t) => this._messageArea = t} cols="50" rows="10" name="message" type="text"/>
        <div><button onClick={this.submitMessage} className={this.state.submitting ? 'disabled' : ''}>{this.state.submitting ? 'Submitting...' : 'Submit bug report'}</button></div>
        </section>
        <section>
        Developers, feel free to instead <Link href="https://github.com/lbryio/lbry/issues" label="submit an issue on GitHub"/>.
        </section>
        <section>
          <Link href="/?help" label="<< Return to Help"/>
        </section>
      </main>
    );
  }
});