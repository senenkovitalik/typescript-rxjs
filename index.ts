import { from, Observable } from "rxjs";
import { first, switchMap, tap } from "rxjs/operators";

function _createConnection(): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      resolve({
        queryStream: sql => {
          return new Promise((resolve, reject) => {
            setTimeout(function() {
              resolve([1, 2, 3, 4, 5]); // data from DB
            }, 450);
          });
        }
      });
    }, 250);
  });
}

function getConnection(): Observable<any> {
  return from(_createConnection());
}

const executeQuery = sql =>
  getConnection().pipe(
    switchMap(connection => from(connection.queryStream(sql)))
  );

function select(sql): Observable<any> {
  return executeQuery(sql);
}

function getAllUsers(): Observable<any> {
  const sql = "SELECT * FROM users";
  return new Observable(observer => {
    select(sql).subscribe(
      data => observer.next(data),
      err => {},
      () => observer.complete()
    );
  });
}

getAllUsers().subscribe(
  data => console.log(data),
  err => {},
  () => {}
);
