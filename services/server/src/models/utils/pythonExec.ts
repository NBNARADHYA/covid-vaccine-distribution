import { resolve } from "path";
import { PythonShell } from "python-shell";

export const pythonExec = (
  pythonScript: string,
  args: string[]
): Promise<string[]> => {
  return new Promise((done, reject) =>
    PythonShell.run(
      resolve(pythonScript),
      {
        args,
        pythonPath:
          process.env.NODE_ENV === "development"
            ? "mlModel/venv/bin/python3"
            : undefined,
      },
      (err, results?: string[]) =>
        err
          ? reject(err)
          : !results
          ? reject("Error generating score")
          : done(results)
    )
  );
};
