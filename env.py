import os
import signal
import gi
gi.require_version('Gtk', '3.0')
from gi.repository import Gtk


class MyWindow(Gtk.Window):

    def __init__(self):
        Gtk.Window.__init__(self, title="Hello World")
        self.set_default_size(400, 600)

        scrolled = Gtk.ScrolledWindow()
        scrolled.set_policy(Gtk.PolicyType.AUTOMATIC, Gtk.PolicyType.AUTOMATIC)

        self.liststore = Gtk.ListStore(str, str)
        for k, v in sorted(os.environ.items()):
            self.liststore.append([k, v])

        # textview = Gtk.TextView()
        # textbuffer = textview.get_buffer()
        # # self.textview.set_wrap_mode(Gtk.WrapMode.WORD)
        # text = ''
        # for k, v in os.environ.items():
        #     text = text + ('%s %s\n' % (k, v))
        # textbuffer.set_text(text)
        # scrolled.add(textview)

        treeview = Gtk.TreeView(model=self.liststore)

        col1 = Gtk.TreeViewColumn("Environment", Gtk.CellRendererText(), text=0)
        treeview.append_column(col1)

        col2 = Gtk.TreeViewColumn("Value", Gtk.CellRendererText(), text=1)
        treeview.append_column(col2)

        scrolled.add(treeview)
        self.add(scrolled)


    def on_button_clicked(self, widget):
        print("Hello World")



window = MyWindow()
window.connect("delete-event", Gtk.main_quit)
signal.signal(signal.SIGINT, signal.SIG_DFL)
window.show_all()
Gtk.main()
