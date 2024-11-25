class Message {
    constructor(
      message_id,
      conversation_id,
      sender_id,
      content,
      created_at
    ) {
      this.message_id = message_id;
      this.conversation_id = conversation_id;
      this.sender_id = sender_id;
      this.content = content;
      this.created_at = created_at;
    }
  }
  