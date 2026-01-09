import * as v from "valibot";

const mutedUsersSchema = v.array(v.string());

type Service = "bookmark" | "bluesky";

export type MuteUserParams = {
  service: Service;
  id: string;
};

export function muteUser({ service, id }: MuteUserParams): void {
  const mutedUsers = getMutedUsers(service);
  if (mutedUsers.includes(id)) {
    return;
  }
  const users = [...mutedUsers, id];
  localStorage.setItem(getKey(service), JSON.stringify(users));
}

export function unmuteUser({ service, id }: MuteUserParams): void {
  const mutedUsers = getMutedUsers(service);
  if (!mutedUsers.includes(id)) {
    return;
  }
  const users = mutedUsers.filter((user) => user !== id);
  users.length !== 0
    ? localStorage.setItem(getKey(service), JSON.stringify(users))
    : clearMutedUsers(service);
}

export function getMutedUsers(service: Service): string[] {
  const value = localStorage.getItem(getKey(service));
  return value ? v.parse(mutedUsersSchema, JSON.parse(value)) : [];
}

export function clearMutedUsers(service: Service): void {
  localStorage.removeItem(getKey(service));
}

function getKey(service: Service): string {
  return `mutedUsers:${service}`;
}

if (import.meta.vitest) {
  const { describe, it, expect, beforeEach } = import.meta.vitest;

  describe("muteUser", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should mute a user", () => {
      muteUser({ service: "bookmark", id: "user_A" });
      expect(getMutedUsers("bookmark")).toEqual(["user_A"]);
    });

    it("should not mute the same user twice", () => {
      muteUser({ service: "bookmark", id: "user_A" });
      muteUser({ service: "bookmark", id: "user_A" });
      expect(getMutedUsers("bookmark")).toEqual(["user_A"]);
    });

    it("should not affect other services when muting a user", () => {
      muteUser({ service: "bookmark", id: "user_A" });
      expect(getMutedUsers("bluesky")).toEqual([]);
    });
  });

  describe("unmuteUser", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should unmute a user and keep other muted users", () => {
      const users = ["user_A", "user_B", "user_C"];
      for (const user of users) {
        muteUser({ service: "bookmark", id: user });
      }
      unmuteUser({ service: "bookmark", id: "user_B" });
      expect(getMutedUsers("bookmark")).not.toContain("user_B");
    });

    it("should remove storage item when last user is unmuted", () => {
      const users = ["user_A", "user_B", "user_C"];
      for (const user of users) {
        muteUser({ service: "bookmark", id: user });
      }
      for (const user of users) {
        unmuteUser({ service: "bookmark", id: user });
      }
      expect(localStorage.getItem(getKey("bookmark"))).toBeNull();
    });

    it("should not affect other services when unmuting a user", () => {
      const users = ["user_A", "user_B", "user_C"];
      for (const user of users) {
        muteUser({ service: "bookmark", id: user });
      }
      unmuteUser({ service: "bluesky", id: "user_B" });
      expect(getMutedUsers("bookmark")).toEqual(users);
    });

    it("should not fail when unmuting a non-muted user", () => {
      expect(() =>
        unmuteUser({ service: "bookmark", id: "user_A" }),
      ).not.toThrow();
    });
  });

  describe("getMutedUsers", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should return an empty array when no users are muted", () => {
      expect(getMutedUsers("bookmark")).toEqual([]);
    });

    it("should return the list of muted users", () => {
      const users = ["user_A", "user_B", "user_C"];
      for (const user of users) {
        muteUser({ service: "bookmark", id: user });
      }
      expect(getMutedUsers("bookmark")).toEqual(users);
    });
  });

  describe("clearMutedUsers", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("should clear all muted users for a service", () => {
      const users = ["user_A", "user_B", "user_C"];
      for (const user of users) {
        muteUser({ service: "bookmark", id: user });
      }
      clearMutedUsers("bookmark");
      expect(getMutedUsers("bookmark")).toEqual([]);
    });

    it("should not affect other services when clearing muted users", () => {
      const users = ["user_A", "user_B", "user_C"];
      for (const user of users) {
        muteUser({ service: "bluesky", id: user });
      }
      clearMutedUsers("bookmark");
      expect(getMutedUsers("bluesky")).toEqual(users);
    });
  });

  describe("getKey", () => {
    it("should return the correct key for bookmark", () => {
      expect(getKey("bookmark")).toBe("mutedUsers:bookmark");
    });

    it("should return the correct key for bluesky", () => {
      expect(getKey("bluesky")).toBe("mutedUsers:bluesky");
    });
  });
}
