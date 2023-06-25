const knex = require("../knex");

class Event {
  static async list() {
    const query = `
      SELECT events.*, username 
      FROM events 
      JOIN users on events.organizer_id = users.id
      ORDER BY events.created_at DESC
    `;
    const { rows } = await knex.raw(query);
    console.log(rows);
    return rows;
  }

  static async find(id) {
    const query = "SELECT * FROM events WHERE id = ?";
    const {
      rows: [event],
    } = await knex.raw(query, [id]);
    return event ? new Event(event) : null;
  }

  static async create(
    organizer_id,
    type,
    title,
    start_date,
    end_date,
    start_time,
    end_time,
    location,
    borough,
    description,
    image,
  ) {
    const event = {
      organizer_id,
      type,
      title,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      borough,
      description,
      image,
    };

    const [newEvent] = await knex("events").insert(event).returning("*");
    return new Event(newEvent);
  }

  static async update(id, updatedEvent) {
    const [updated] = await knex("events")
      .where({ id })
      .update(updatedEvent, ["*"]);

    return updated ?? null;
  }

  static async delete(id) {
    const query = "DELETE FROM events WHERE id = ?";
    return knex.raw(query, [id]);
  }

  static async deleteAll() {
    return knex.raw("TRUNCATE events RESTART IDENTITY CASCADE;");
  }
}

module.exports = Event;
