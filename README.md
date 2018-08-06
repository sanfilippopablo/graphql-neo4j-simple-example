`docker-compose up` and go to `http://localhost:8000/graphql`.

Try with this query:
```
query {
  books {
    title,
    author {
      name
    }
  }
}
```