class AdminIviteSubscriber {
  constructor({ sendgridService, eventBusService }) {
    this.sendGridService_ = sendgridService;

    eventBusService.subscribe("invite.created", this.handleSendInvite);
  }

  handleSendInvite = async (data) => {
    const { id, token, user_email } = data;

    return await this.sendGridService_.sendEmail({
      from: process.env.SENDGRID_FROM,
      to: user_email,
      subject: "You have been invited to join the ACME admin team",
      templateId: process.env.INVITE_CREATED_ID,
      data: {
        token: token,
        id: id,
      },
    });
  };
}

export default AdminIviteSubscriber;