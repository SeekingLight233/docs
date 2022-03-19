import { of, distinctUntilChanged } from 'rxjs';

of(1, 1, 1, 3, 3, 5, 5)
  .pipe(distinctUntilChanged())
  .subscribe(console.log);

//1 3 5
