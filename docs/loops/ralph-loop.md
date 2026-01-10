# Repeated Work

/ralph-loop "Work on ONE of {issue-id} child, pick the most important one. If
one child is already in_progress, resume. After ensuring that particular test
passed, 'land the plane'.

When all children of that issue is closed, output <promise>DONE</promise>"
--max-iterations 10 --completion-promise "DONE"
