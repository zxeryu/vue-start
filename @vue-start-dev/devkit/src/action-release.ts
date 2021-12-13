import { IState } from "./state";
import { exec, syncExec } from "./exec";

export const fromCommitRefName = (commitTag = ""): { name: string; feature: string; env: string } => {
  const rule = commitTag.replace(/^feat(ure)?\//, "");

  const [appAndFeature, env] = rule.split(".");
  const [name, feature] = appAndFeature.split("--", 2);

  return {
    name,
    feature,
    env,
  };
};

export const toCommitRefName = (state: IState): String =>
  `feat/${state.name}` + `${state.env && state.env !== "default" && state.env !== "staging" ? `.${state.env}` : ""}`;

export const release = (state: IState): void => {
  const tag = toCommitRefName(state);
  const commitMsg = `build(${state.name}): rewrite helmx.project.yml`;
  syncExec(`git add helmx.project.yml`, state);
  syncExec(`git commit -m "${commitMsg}"`, state);
  syncExec(`git push origin --force`, state);
  exec(`git tag -f ${tag}`, state);
  exec(`git push -f origin refs/tags/${tag}`, state);
};
