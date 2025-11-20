## 💡 Inspiration

Vibe coding is fast, but brutal to maintain. Spinning up an app and shipping it takes less than a day, then three months later the code base is unreadable and adding even the simplest feature takes weeks. VibeEngine was created to decipher the indecipherable code. VibeEngine makes complex enterprise infrastructure as understandable and flexible as personal projects.

## 🧰 What it does

VibeEngine understands your codebase more intuitively than anyone or anything ever before. VibeEngine connects to your GitHub and allows you to connect your repositories in a few simple clicks. It generates  descriptions for all your core features and processes, helping you, and anyone on your team manage your codebase. VibeEngine builds out an extensive feature map, showing the connections between key features and systems in your repository. This visualization enables developers to understand and manage their codebase. Beyond just summarizing your existing codebase, VibeEngine’s intuitive understanding of the code base allows it to add new features seamlessly to your project. If the user wants to add a new feature, they simply prompt VibeEngine, and it develops and pushes the update to the GitHub repository automatically. VibeEngine then updates the feature map, allowing the user to immediately see the effects the new feature has on their structure. 

## 🔨 How we built it

* AWS Step Functions orchestration -- We build two serverless state machines to handle multi-stage AI workflows. The first handles repository analysis by iterating through every file, building a json of the features in the repository. The second state machine calls the AI with a graph generation prompt to infer the dependency relationships. 
* Gemini function calling as infrastructure  -- Rather than treat AI as a simple prompting system, we defined tools that turn Gemini into an autonomous GitHub client. We provide Gemini with the ability to read, change file contents, and commit changes directly to repositories, expediting the development process.
* MongoDB document models -- We implemented two structures: projects that represent repositories with a one-to-one user relationship and features that contain technical/non-technical summaries, file references, and neighbor arrays for graph connections
* S3 prompt storage with Lambda integration -- We store AI prompts in a dedicated S3 bucket with access only granted to lambda. This separation lets us version control prompts independently from the code and hot swap prompt templates without redeploying the whole website. The AI engine then loads different prompts for feature extraction, graph generation, and feature creation

## 🚧 Challenges we ran into

* Implementing GItHub OAuth -- AWS Amplify does not natively support OAuth, causing us to implement it ourselves 
* Developing a Serverless App -- Developing a serverless app taught us rewire how we thought about execution—every task became a lambda function and complex flows turned into Step Function state machine 

## ⭐ Accomplishments that we're proud of
* Partially serverless architecture with AWS integration -- Architected a production-grade serverless stack using AWS Amplify Gen 2, GitHub OAuth, multiple Lambda functions with custom resolvers, Step Functions for workflow orchestration, and MongoDB with relational models
* Two stage agentic workflow -- Built a complete AI workflow orchestration with AWS Step Functions, multiple Lambda resolvers (Gemini, GitHub, OAuth, workflow status), MongoDB for state management, S3 for prompt storage, and a React dashboard with real-time polling
* Feature map – Built a stateful analysis system that processes repositories file-by-file, incrementally building a map of all the critical features and providing in-depth explanations. The feature map is updated every time the repository is updated, helping the user better understand changes VibeEngine makes to their project.

## 📚 What we learned
* Developing a Serverless App -- developing a serverless app made us rewire how we thought about execution—every task became a lambda function and complex flows turned into Step Function state machine 
* Agentic workflows need orchestration -- initially we attempted to generate everything in one prompt but soon learned that multi stage prompting to build an agentic workflow requires proper state machines 

## ➡️ What's next for VibeEngine
* Integrate with enterprise CI/CD tools (GitHub Actions, GitLab CI, Jenkins, AWS CodePipeline).
* Build guided vibecoding companion for VS Code and web IDEs.
* Scale to team collaboration tools with shared feature maps and code ownership tagging.
* YC

## References
[1] Hill, Michael. “Ai-Generated Code Surges as Governance Lags.” AI, Data & Analytics Network, 18 Aug. 2025, www.aidataanalytics.network/data-science-ai/news-trends/ai-generated-code-surges-as-governance-lags. Accessed 9 Nov. 2025.

[2] Security Degradation in Iterative AI Code Generation — A Systematic Analysis of the Paradox, www.researchgate.net/publication/392716752_Security_Degradation_in_Iterative_AI_Code_Generation_—_A_Systematic_Analysis_of_the_Paradox. Accessed 9 Nov. 2025.

[3] Ge, Yuyao, et al. “A Survey of Vibe Coding with Large Language Models.” arXiv.Org, 14 Oct. 2025, arxiv.org/abs/2510.12399. Accessed 9 Nov. 2025.

