// From Udacity'JavaScript Developer Nanodegree edited by Tanhapon Tosirikul 2781155t
import { app } from "./app";
const env = process.env.ENV;

const port = 3000;

app.listen(port, (): void => {
  console.log(`server ${env} started at localhost:${port}`);
});
