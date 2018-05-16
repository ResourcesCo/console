const START_DATE = new Date(Date.UTC(2018, 0, 1));

class RequestCollection {
  constructor({path, startDate = START_DATE}) {
    this.path = path;
    this.startDate = START_DATE;
  }

  insert(request) {
  }

  get(request) {
  }

  list(request, before = null) {
  }

  loadRecent() {

  }

  refreshRecent() {
  }

  archiveRecent() {
    
  }
}