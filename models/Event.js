class Event {
    constructor(id, title, description, date, location, organizer, type, numPart, pic) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.date = date;
      this.location = location;
      this.organizer = organizer;
      this.type = type;
      this.numPart = numPart;
      this.pic = pic;
    }
  
  // Method to format the date
  formatDate() {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(this.date).toLocaleDateString(undefined, options);
  }

  // Method to format the location
  formatLocation() {
    return '${this.location.city}, ${this.location.country}';
  }

  // Method to format the title
  formatTitle() {
    return this.title.toUpperCase();
  }

  // Method to format the description
  formatDescription() {
    return this.description.length > 100 ? '${this.description.substring(0, 100)}...' : this.description;
  }

  // Method to format the organizer
  formatOrganizer() {
    return 'Organized by: ${this.organizer}';
  }

  // Method to format the type
  formatType() {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1);
  }

  // Method to format the number of participants
  formatNumPart() {
    return '${this.numPart} participants';
  }



  // Method to update event attributes
  updateAttribute(attribute, value) {
    if (this.hasOwnProperty(attribute)) {
      this[attribute] = value;
    } else {
      console.warn("Attribute ${attribute} does not exist on Event object.");
    }
  }
}