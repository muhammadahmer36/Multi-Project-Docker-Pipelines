using System;
using System.Collections.Generic;

namespace EcotimeMobileAPI.CommonClasses.BaseClasses
{
    public abstract class Observable<TSubscriber> : IDisposable
    {
        protected HashSet<TSubscriber> _subscribers = new();

        public int NoOfSubscribers { get => _subscribers.Count; }

        public void Dispose()
        {
            _subscribers.Clear();
        }

        protected void Subscribe(params TSubscriber[] subscribers)
        {
            for (int i = 0; i < subscribers.Length; i++) _subscribers.Add(subscribers[i]);
        }
    }
}
