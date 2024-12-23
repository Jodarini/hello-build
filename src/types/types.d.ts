interface Repository {
  id: string;
  name: string;
  createdAt: string;
  favorite: boolean;
  languages: {
    nodes: [
      {
        id: string;
        name: string;
      },
    ];
  };
}

interface User {
  login: string;
  avatarUrl: string;
}

interface ViewerResponse {
  data: {
    viewer: User;
  };
}
