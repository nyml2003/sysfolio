import { describe, expect, it } from "vitest";

import { isSome, some } from "@/shared/lib/monads/option";

import { createInMemoryContentRepository } from "./create-in-memory-content-repository";

function createRepository() {
  return createInMemoryContentRepository({
    latencyMs: some(0),
  });
}

describe("createInMemoryContentRepository", () => {
  it("returns the expected renderable kinds for home, directory, article, and unknown paths", async () => {
    const repository = createRepository();
    const homeResource = await repository.getRenderableEntryByPath("/");
    const directoryResource = await repository.getRenderableEntryByPath("/archive");
    const articleResource = await repository.getRenderableEntryByPath(
      "/archive/essays/filesystem-reading",
    );
    const missingResource = await repository.getRenderableEntryByPath("/missing");

    expect(homeResource.tag).toBe("ready");
    expect(directoryResource.tag).toBe("ready");
    expect(articleResource.tag).toBe("ready");
    expect(missingResource.tag).toBe("error");

    if (
      homeResource.tag !== "ready" ||
      directoryResource.tag !== "ready" ||
      articleResource.tag !== "ready"
    ) {
      throw new Error("Expected ready resources for known fixture paths.");
    }

    expect(homeResource.value.content.kind).toBe("home");
    expect(directoryResource.value.content.kind).toBe("directory");
    expect(articleResource.value.content.kind).toBe("article");
  });

  it("keeps tree root payload limited to the first two levels", async () => {
    const repository = createRepository();
    const treeRoot = await repository.getTreeRoot();

    expect(treeRoot.tag).toBe("ready");

    if (treeRoot.tag !== "ready") {
      throw new Error("Expected ready tree root payload.");
    }

    const nodeIds = treeRoot.value.nodes.map((node) => node.id);

    expect(nodeIds).toContain("archive");
    expect(nodeIds).toContain("archive-essays");
    expect(nodeIds).not.toContain("article-filesystem-reading");
  });

  it("persists reading progress through the repository boundary", async () => {
    const repository = createRepository();
    const position = {
      scrollTop: 320,
      updatedAt: "2026-03-22T08:00:00.000Z",
    };
    const saveResult = await repository.saveReadingProgress(
      "/archive/essays/filesystem-reading",
      position,
    );
    const restoredResult = await repository.getSavedReadingProgress(
      "/archive/essays/filesystem-reading",
    );

    expect(saveResult.tag).toBe("ready");
    expect(restoredResult.tag).toBe("ready");

    if (restoredResult.tag !== "ready") {
      throw new Error("Expected ready saved reading progress resource.");
    }

    expect(isSome(restoredResult.value)).toBe(true);

    if (!isSome(restoredResult.value)) {
      throw new Error("Expected saved reading progress to exist.");
    }

    expect(restoredResult.value.value).toEqual(position);
  });
});
