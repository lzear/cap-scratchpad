import { buildTestPost } from "./posts";
import { nameSubmissionsHandler } from "./nameSubmissions";

test("Minimal submission", () => {
  const post = buildTestPost(`Final Submission
   
   Koffing
   
   a corruption of "coughing"
   
   Pronounced: KAW-fing
   `);

  const submission = nameSubmissionsHandler.getSubmission(
    {} as HTMLElement,
    post
  );

  expect(submission).not.toBeNull();
});

test("Submission with illegal characters", () => {
  const post = buildTestPost(`Final Submission
    
    X Æ A-Xii
    
    X = "the unknown variable," Æ = "my elven spelling of Ai," A-12 = "precursor to SR-17
    
    Pronounced: ex-ash-a-twelve
    `);

  const submission = nameSubmissionsHandler.getSubmission(
    {} as HTMLElement,
    post
  );

  expect(submission).toBeNull();
});

test("Submission with overly-long description", () => {
  const post = buildTestPost(`Final Submission
   
   Koffing
   
   Considering its looks, its ability to float, and its tendency to explode, Koffing may have been based upon a floating naval mine or living meteorite. It is also based on smog and other forms of air pollution. Koffing may also be based on the imagined fear that heavy pollution, caused by the leakage and/or improper disposal of toxic and/or radioactive waste, may result in the creation of new and undesirable lifeforms. The symbol under its face resembles the skull and crossbones, a hazard symbol for poison. 
   
   Pronounced: KAW-fing
   `);

  const submission = nameSubmissionsHandler.getSubmission(
    {} as HTMLElement,
    post
  );

  expect(submission).toBeNull();
});